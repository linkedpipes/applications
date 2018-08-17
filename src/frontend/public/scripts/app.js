'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _IndecisionApp = require('./components/IndecisionApp');

var _IndecisionApp2 = _interopRequireDefault(_IndecisionApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//   const User = (props) => {
//     return (
//       <div> 
//         <p> Name: {props.name} </p>
//         <p> Age: {props.age} </p>
//       </div>
//     )
//   }

_reactDom2.default.render(_react2.default.createElement(_IndecisionApp2.default, { options: ['opt1', 'opt2'] }), document.getElementById('app')); // import './utils.js'
