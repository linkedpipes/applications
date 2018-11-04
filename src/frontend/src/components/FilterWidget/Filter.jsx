// import React from "react";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import Divider from "@material-ui/core/Divider";
// import Option from "../FilterWidget/Option/Option";

// const Filter = ({ dispatch, filter, status }) => {
//   if (!filter.enabled) {
//     return null;
//   }

//   const onSelect = (uri, selected) => {
//     switch (filter.type) {
//       case types.CHECKBOX:
//         dispatch(selectOption(filter.property.uri, uri, selected));
//         break;
//       case types.RADIO:
//         dispatch(
//           selectAllOptions(filter.property.uri, filter.optionsUris, false)
//         );
//         dispatch(selectOption(filter.property.uri, uri, true));
//         break;
//       default:
//         console.log("Unknown filter type");
//     }
//   };

//   return (
//     <div>
//       <List>
//         {filter.options
//           .filter(option => option.mode != modes.NEVER_SELECT)
//           .toList()
//           .map(option => (
//             <div key={option.skosConcept.uri}>
//               <Option
//                 option={option}
//                 type={filter.type}
//                 onSelect={selected =>
//                   onSelect(option.skosConcept.uri, selected)
//                 }
//               />
//               <Divider />
//             </div>
//           ))}
//       </List>
//     </div>
//   );
// };
