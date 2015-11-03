(function ($) {
  'use strict';

  // Constants
  var KEY_ENTER = 13
    , KEY_SPACE = 32
    , KEY_COMMA = 188
    , KEY_SEMICOLON = 186
    , KEY_BACKSPACE = 8;

  var Taginput = function (el, options) {
    this.$el = $(el);
    this.settings = $.extend({}, Taginput.DEFAULTS, options);
    this.init();
  };

  Taginput.prototype.init = function () {
    this.$el.find('.taginput-input > input').on('keydown', $.proxy(interceptCharacters, this));
    this.$el.find('.taginput-input > input').on('keyup', $.proxy(this.settings.createTagOnKeyup, this));
    this.$el.find('.taginput-input > input').on('blur', $.proxy(createTagOnBlur, this));
    this.$el.find('.taginput-input > input').on('keydown', $.proxy(removePreviousTagByKey, this));
    this.$el.on('click', '.taginput-tag-delete', $.proxy(function (e) { this.removeTag($(e.target).closest('.taginput-tag')); }, this));
  };

  Taginput.prototype.createTagByInput = function ($input) {
    var $tag = $(this.settings.tagTemplate)
      , label = this.settings.formatTagLabel($input)
      , attr = this.settings.formatTagAttr($input);

    $tag.attr(attr).find('.taginput-tag-label').text(label);
    $tag.insertBefore($input.val('').closest('.taginput-input'));
  };

  Taginput.prototype.removeTag = function ($tag) {
    $tag.remove();
  };

  // Private Methods
  // =====================================

  // Prevent certain keys from typed into the input, but allow <Space> for like "john <john@email.com>"
  var interceptCharacters = function (e) {
    if ( isKeyIgnored(e, this.settings.ignoredKeys) ||
         e.which == KEY_SPACE && $(e.target).val().trim().length == 0 ) {
      return false;
    }
  };

  // Make self an email tag and append a new editable span when certain keys are pressed or on blur.
  var createTagOnKeyup = function (e) {
    var $input = $(e.target);
    if ( isKeyDelimiter(e, this.settings.delimiters) && this.settings.isTaggable($input) ) {
      this.createTagByInput($input);
    }
  };

  var createTagOnBlur = function (e) {
    var $input = $(e.target);
    if ($input.val().trim().length > 0) { this.createTagByInput($input); }
  };

  var isTaggable = function ($input) {
    return $input.val().trim().length > 0;
  };

  var formatTagLabel = function ($input) { return $input.val().trim(); };

  var formatTagAttr = function ($input) { return { "data-value": $input.val().trim() }; };

  var isKeyDelimiter = function (e, delimiters) {
    if (delimiters == null) { delimiters = []; }
    return $.inArray(e.which, delimiters) != -1 && !e.shiftKey;
  };

  var isKeyIgnored = function (e, ignoredKeys) {
    if (ignoredKeys == null) { ignoredKeys = []; }
    return $.inArray(e.which, ignoredKeys) != -1 && !e.shiftKey;
  };

  var removePreviousTagByKey = function (e) {
    var $input = $(e.target);
    if (e.which == KEY_BACKSPACE && $input.val().length == 0) {
      this.removeTag($input.closest('.taginput-input').prev('.taginput-tag'));
    }
  };

  // Taginput Plugin Defaults
  // =====================================

  Taginput.DEFAULTS = {
    delimiters: [KEY_ENTER, KEY_SPACE, KEY_COMMA, KEY_SEMICOLON],
    ignoredKeys: [KEY_ENTER, KEY_SPACE, KEY_COMMA, KEY_SEMICOLON],
    tagTemplate: '<li class="taginput-tag"><span class="taginput-tag-label"></span><span class="taginput-tag-delete">&times;</span></li>',
    inputTemplate: '<li class="taginput-input"><input></li>',
    isTaggable: isTaggable,
    createTagOnKeyup: createTagOnKeyup,
    formatTagLabel: formatTagLabel,
    formatTagAttr: formatTagAttr
  };

  // Taginput Plugin Definition
  // =====================================

  function Plugin(option) {
    return this.each(function (){
      var $this   = $(this)
        , data    = $this.data('artsy.taginput')
        , options = typeof option == 'object' && option;

      if (!data) {
        $this.data('artsy.taginput', (data = new Taginput(this, options)));
      }
    })
  }

  $.fn.taginput = Plugin;

})(jQuery);
