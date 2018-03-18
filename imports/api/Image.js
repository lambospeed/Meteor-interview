import { Meteor } from 'meteor/meteor';

var Images = new FS.Collection("Images", {
  stores: [new FS.Store.FileSystem("Images", {path: "../../../../../public/~/uploads"})]
});



if (Meteor.isServer) {
  Images.allow({
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
  Meteor.publish('images', function () {
    return Images.find({});
  });
};

export default Images;