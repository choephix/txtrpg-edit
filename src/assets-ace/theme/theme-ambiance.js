ace.define("ace/theme/ambiance",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-ambiance";
exports.cssText = ".ace-ambiance .ace_gutter {\
background-color: #3D3D3D;\
background-image: -moz-linear-gradient(left, #3D3D3D, #333);\
background-image: -ms-linear-gradient(left, #3D3D3D, #333);\
background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#3D3D3D), to(#333));\
background-image: -webkit-linear-gradient(left, #3D3D3D, #333);\
background-image: -o-linear-gradient(left, #3D3D3D, #333);\
background-image: linear-gradient(left, #3D3D3D, #333);\
background-repeat: repeat-x;\
border-right: 1px solid #4d4d4d;\
text-shadow: 0px 1px 1px #4d4d4d;\
color: #222;\
}\
.ace-ambiance .ace_gutter-layer {\
background: repeat left top;\
}\
.ace-ambiance .ace_gutter-active-line {\
background-color: #3F3F3F;\
}\
.ace-ambiance .ace_fold-widget {\
text-align: center;\
}\
.ace-ambiance .ace_fold-widget:hover {\
color: #777;\
}\
.ace-ambiance .ace_fold-widget.ace_start,\
.ace-ambiance .ace_fold-widget.ace_end,\
.ace-ambiance .ace_fold-widget.ace_closed{\
background: none;\
border: none;\
box-shadow: none;\
}\
.ace-ambiance .ace_fold-widget.ace_start:after {\
content: '▾'\
}\
.ace-ambiance .ace_fold-widget.ace_end:after {\
content: '▴'\
}\
.ace-ambiance .ace_fold-widget.ace_closed:after {\
content: '‣'\
}\
.ace-ambiance .ace_print-margin {\
border-left: 1px dotted #2D2D2D;\
right: 0;\
background: #262626;\
}\
.ace-ambiance .ace_scroller {\
-webkit-box-shadow: inset 0 0 4px #000C;\
-moz-box-shadow: inset 0 0 4px #000C;\
-o-box-shadow: inset 0 0 4px #000C;\
box-shadow: inset 0 0 4px #000C;\
}\
.ace-ambiance {\
border-top: 1px solid #000C;\
color: #E6E1DC;\
background-color: #292929;\
}\
.ace-ambiance .ace_cursor {\
border-left: 1px solid #7991E8;\
}\
.ace-ambiance .ace_overwrite-cursors .ace_cursor {\
border: 1px solid #FFE300;\
background: #766B13;\
}\
.ace-ambiance.normal-mode .ace_cursor-layer {\
z-index: 0;\
}\
.ace-ambiance .ace_marker-layer .ace_selection {\
background: rgba(5, 100, 255, 0.15);\
}\
.ace-ambiance .ace_marker-layer .ace_selected-word {\
border-radius: 4px;\
border: 8px solid #3f475d;\
box-shadow: 0 0 4px black;\
}\
.ace-ambiance .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174);\
}\
.ace-ambiance .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(255, 255, 255, 0.25);\
}\
.ace-ambiance .ace_marker-layer .ace_active-line {\
background: rgba(255, 255, 255, 0.031);\
}\
.ace-ambiance .ace_invisible {\
color: #333;\
}\
.ace-ambiance .ace_paren {\
color: #24C2C7;\
}\
.ace-ambiance .ace_keyword {\
color: #cda869;\
}\
.ace-ambiance .ace_keyword.ace_operator {\
color: #fa8d6a;\
}\
.ace-ambiance .ace_punctuation.ace_operator {\
color: #fa8d6a;\
}\
.ace-ambiance .ace_identifier {\
}\
.ace-ambiance .ace-statement {\
color: #cda869;\
}\
.ace-ambiance .ace_constant {\
color: #CF7EA9;\
}\
.ace-ambiance .ace_constant.ace_language {\
color: #CF7EA9;\
}\
.ace-ambiance .ace_constant.ace_library {\
}\
.ace-ambiance .ace_constant.ace_numeric {\
color: #78CF8A;\
}\
.ace-ambiance .ace_invalid {\
text-decoration: underline;\
}\
.ace-ambiance .ace_invalid.ace_illegal {\
color:#F8F8F8;\
background-color: rgba(86, 45, 86, 0.75);\
}\
.ace-ambiance .ace_invalid,\
.ace-ambiance .ace_deprecated {\
text-decoration: underline;\
font-style: italic;\
color: #D2A8A1;\
}\
.ace-ambiance .ace_support {\
color: #9B859D;\
}\
.ace-ambiance .ace_support.ace_function {\
color: #DAD085;\
}\
.ace-ambiance .ace_function.ace_buildin {\
color: #9b859d;\
}\
.ace-ambiance .ace_string {\
color: #8f9d6a;\
}\
.ace-ambiance .ace_string.ace_regexp {\
color: #DAD085;\
}\
.ace-ambiance .ace_comment {\
font-style: italic;\
color: #5f5f65;\
}\
.ace-ambiance .ace_comment.ace_doc {\
}\
.ace-ambiance .ace_comment.ace_doc.ace_tag {\
color: #666;\
font-style: normal;\
}\
.ace-ambiance .ace_definition,\
.ace-ambiance .ace_type {\
color: #aac6e3;\
}\
.ace-ambiance .ace_variable {\
color: #9999cc;\
}\
.ace-ambiance .ace_variable.ace_language {\
color: #9b859d;\
}\
.ace-ambiance .ace_xml-pe {\
color: #494949;\
}\
.ace-ambiance .ace_gutter-layer,\
.ace-ambiance .ace_text-layer {\
}\
.ace-ambiance .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNQUFD4z6Crq/sfAAuYAuYl+7lfAAAAAElFTkSuQmCC\") right repeat-y;\
}";

var dom = acequire("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);

});
