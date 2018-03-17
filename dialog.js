'use strict';

var Dialog = (function(){
  function Dialog(dialogId) {
    this.dialogId = dialogId;
    this.dialogContainer = document.getElementById(dialogId);
    this.dialogBackground = document.querySelector(
      "#" + dialogId + " .dialog-background");
    this.dialogContent = document.querySelector(
      "#" + dialogId + " .dialog-content");
  };

  Dialog.prototype.show = function() {
    this.dialogContainer.style.opacity = 0;
    this.dialogContainer.style.display = 'block';
    var e = $(this.dialogContent);
    var top = e[0].scrollHeight
      + parseInt(e.css('margin-top')) + parseInt(e.css('margin-bottom'));
    this.dialogContent.style.top = "-" + top + "px";
    this.dialogContainer.style.opacity = 1;

    this.dialogBackground.classList.add('dialog-show-background');

    this.dialogBackground.onclick = function() {
      this.hide();
    }.bind(this);

    setTimeout(function() {
      this.dialogContent.classList.add('dialog-show-content');
    }.bind(this), 300);
  };

  Dialog.prototype.hide = function() {
    this.dialogContent.classList.remove('dialog-show-content');

    setTimeout(function() {
      this.dialogBackground.classList.remove('dialog-show-background');
    }.bind(this), 500);

    setTimeout(function() {
      this.dialogContainer.style.display = 'none';
    }.bind(this), 500);
  };

  return Dialog;
})();
