var exports = module.exports = {};

var Git = require('nodegit');

var path = require('path');
var promisify = require('promisify-node');
var fse = promisify(require('fs-extra'));

var directoryName = 'bills';

var log = require('debug')('billtracker:git');
var async = require('async');

// fix por async. see https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js#L8
fse.ensureDir = promisify(fse.ensureDir);

exports.commitToGit = function (billID, billContents) {
  var fileName = billID + '.txt';

  log('Bill with ID ' + billID + ' commited to git');
  log('Bill contents: ' + billContents);

  var repo;
  var index;
  var oid;

  Git.Repository.open('../billtracker_git')
    .then(function (repository) {
      repo = repository;
      return fse.ensureDir(path.join(repo.workdir(), directoryName));
    })
    .then(function () {
      return fse.writeFile(path.join(repo.workdir(), directoryName, fileName), billContents);
    })
    .then(function () {
      return repo.openIndex();
    })
    .then(function (indexResult) {
      index = indexResult;
      return index.read(1);
    })
    .then(function () {
      return index.addByPath(path.join(directoryName, fileName));
    })
    .then(function () {
      return index.write();
    })
    .then(function () {
      return index.writeTree();
    })
    .then(function (oidResult) {
      oid = oidResult;
      return Git.Reference.nameToId(repo, 'HEAD');
    })
    .then(function (head) {
      return repo.getCommit(head);
    })
    .then(function (parent) {
      var author = Git.Signature.create('Bill Tracker',
        'billtracker@democraciaenred.com', 123456789, 60);
      var committer = Git.Signature.create('Bill Tracker',
        'billtracker@democraciaenred.com', 987654321, 90);

      return repo.createCommit('HEAD', author, committer, 'Commited new revision for Bill ' + billID, oid, [parent]);
    })
    .done(function (commitId) {
      log('New Commit: ', commitId);
    });
};

function readFileFromGit(billID, commitID, callback) {
  Git.Repository.open('../billtracker_git')
    .then(function (repo) {
      return repo.getCommit(commitID);
    })
    .then(function (commit) {
      return commit.getEntry('bills/' + billID + '.txt');
    })
    .then(function (entry) {
      return entry.getBlob();
    })
    .then(function (blob) {
      return blob.toString();
    })
    .done(callback);
}

exports.readFullFileHistory = function readFullFileHistory(req, res, next) {
  // TO-DO should not reach here without a Bill, why wasn't it catched before?
  if (!req.bill) {
    log('Cannot read git history of null Bill');
    return next(new Error('Cannot read git history of null Bill'));
  }

  readCommitHistory(req.bill._id, function (commits) {
    var calls = [];

    commits.forEach(function (entry) {
      calls.push(function (callback) {
        readFileFromGit(req.bill._id, entry.commit.sha(), function (contents) {
          req.bill.stages.push({
            'stageID': entry.commit.sha(),
            'stageDate': entry.commit.date(),
            'contents': contents
          });
          callback(null, contents);
        });
      });
    });

    async.parallel(calls, function (err, result) {
      if (!err) return next();
    });
  });
};

function readCommitHistory(billID, callback) {
  var walker;
  var repo;
  var filename;

  filename = 'bills/' + billID + '.txt';
  Git.Repository.open('../billtracker_git')
    .then(function (r) {
      repo = r;
      return repo.getMasterCommit();
    })
    .then(function (firstCommitOnMaster) {
      walker = repo.createRevWalk();
      walker.push(firstCommitOnMaster.sha());
      walker.sorting(Git.Revwalk.SORT.Time);

      return walker.fileHistoryWalk(filename, 500);
    })
    .then(callback)
    .done();
}

exports.getDiffBetweenCommits = function (req, res, next) {
  var commitID1 = req.params.stageID1;
  var commitID2 = req.params.stageID2;

  var repo;
  var done = false;

  Git.Repository.open('../billtracker_git')
    .then(function (repository) {
      repo = repository;
      return repo.getCommit(commitID1);
    })
    .then(function (firstCommit) {
      req.commit1 = firstCommit;
      return repo.getCommit(commitID2);
    })
    .then(function (commit2) {
      req.commit2 = commit2;
      req.gitOptions = null;
      return;
    })
    .then(function () {
      return req.commit1.getTree();
    })
    .then(function (commitTree) {
      req.commit1Tree = commitTree;
      return req.commit2.getTree();
    })
    .then(function (commitTree) {
      req.commit2Tree = commitTree;
      return;
    })
    .then(function () {
      return req.commit1Tree.diffWithOptions(req.commit2Tree, req.gitOptions);
    })
    .then(function (diffs) {
      var diffResult = [];
      req.diffResult = diffResult;

      diffs.patches().then(function (patches) {
        patches.forEach(function (patch) {
          patch.hunks().then(function (hunks) {
            hunks.forEach(function (hunk) {
              hunk.lines().then(function (lines) {
                lines.forEach(function (line) {
                  var diffString = String.fromCharCode(line.origin()) + line.content().trim();
                  log('Diff line: ' + diffString);
                  diffResult.push(diffString);
                });

                next();
              });
            });
          });
        });
      });
    });
};