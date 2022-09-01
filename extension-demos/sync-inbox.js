//---- Install script easily ----//

$app.strings = {
  "en": {
    "MAIN_TITLE": "Installer",
    "EMPTY_TIPS": "Please import script use AirDrop or File Sharing",
    "IMPORT_DELETE": "Import & Delete",
    "DELETE_DIRECTLY": "Delete Directly"
  },
  "zh-Hans": {
    "MAIN_TITLE": "Script Installer",

"EMPTY_TIPS": "Please import scripts through AirDrop or file sharing",

"IMPORT_DELETE": "DELETE AFTER IMPORT",

"DELETE_DIRECTLY": "DELETE DIRECTLY"
  }
}

var file = $context.data

if (file && file.fileName) {
  install(file.fileName, file)
  return
}

function install(name, data) {
  $addin.save({name: name, data: data})
}

var scheme = "inbox://";
var files = $file.list(scheme) || []

$ui.render({
  props: {
    title: $l10n("MAIN_TITLE")
  },
  views: [{
    type: "list",
    props: {
      data: files
    },
    layout: $layout.fill,
    events: {
      didSelect: function(sender, indexPath) {
        var name = files[indexPath.row]
        var path = scheme + name
        function _delete() {
          $file.delete(path)
          sender.delete(indexPath)
        }
        $ui.menu({
          items: [$l10n("IMPORT_DELETE"), $l10n("DELETE_DIRECTLY")],
          handler: function(title, idx) {
            if (idx == 0) {
              install(name, $file.read(path))
              _delete()
            } else if (idx == 1) {
              _delete()
            }
          }
        })
      }
    }
  }, {
    type: "label",
    props: {
      hidden: files.length > 0,
      text: $l10n("EMPTY_TIPS"),
      lines: 0,
      align: $align.center
    },
    layout: function(make, view) {
      make.left.right.top.bottom.inset(20)
    }
  }]
})
