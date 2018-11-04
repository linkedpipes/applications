// import React from "react";
// import Divider from "@material-ui/core/Divider";
// import Checkbox from "@material-ui/core/Checkbox";
// import Radio from "@material-ui/core/Radio";
// import { optionModes as modes } from "../../../_constants/options.constants";
// import { filterTypes as types } from "../../../_constants/filters.constants";

// import { Option as OptionModel } from "../models";
// import Padding from "../../../../components/Padding";
// import EditableLabel from "../../../app/containers/EditableLabel";
// import { createSkosConceptsStatusSelector } from "../ducks/skosConcepts";

// const Option = ({ option, type, onSelect }) => {
//   const { count, mode, skosConcept } = option;

//   const label = (
//     <span>
//       <EditableLabel uri={skosConcept.uri} label={skosConcept.label} />
//       {count !== null && <span style={countStyle}> ({count})</span>}
//     </span>
//   );

//   return (
//     <div>
//       <Padding space={2}>
//         <div style={Object.assign({}, labelStyle, configStyles[mode])}>
//           {type == types.CHECKBOX ? (
//             <Checkbox
//               disabled={mode == modes.ALWAYS_SELECT}
//               onCheck={(_, isActive) => onSelect(isActive)}
//               checked={option.selected}
//               label={label}
//             />
//           ) : (
//             <Radio
//               disabled={mode == modes.ALWAYS_SELECT}
//               value={skosConcept.uri}
//               onCheck={onSelect}
//               label={label}
//               checked={option.selected}
//             />
//           )}
//         </div>
//       </Padding>
//       <Divider style={dividerStyle} />
//     </div>
//   );
// };

// Option.propTypes = {
//   option: PropTypes.instanceOf(OptionModel).isRequired,
//   type: PropTypes.oneOf([types.CHECKBOX, types.RADIO]).isRequired,
//   onSelect: PropTypes.func.isRequired
// };

// export default Option;
