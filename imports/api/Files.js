import { Meteor } from 'meteor/meteor';

var Files = new FS.Collection("Files", {
  stores: [new FS.Store.FileSystem("Files", {path: "../../../../../public/~/uploads"})]
});



if (Meteor.isServer) {
  Files.allow({
    update: function () {
        return true;
    },
    insert: function () {
      return true;
    },
    remove: function() {
      return true;
    },
    download: function() {
      return true;
    }
  });
  Meteor.publish('files', function () {
    return Files.find({});
  });
};

export default Files;