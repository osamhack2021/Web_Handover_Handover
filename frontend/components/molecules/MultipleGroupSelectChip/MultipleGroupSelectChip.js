import { FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import * as React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(item, selection, theme) {
  return {
    fontWeight:
      selection && selection.find(e => e._id === item) == null
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// Code from: https://mui.com/components/selects/#chip
export default function MultipleGroupSelectChip({
  label,
  selectedGroups = [],
  helperText,
  items,
  onChange,
  ...props
}) {
  const theme = useTheme();
  const [selection, setSelection] = React.useState(selectedGroups);

  React.useEffect(() => {
    setSelection(selectedGroups);
  }, [selectedGroups]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    let newSelection = typeof value === "string" ? value.split(",") : value;

    setSelection(
      // On autofill we get a the stringified value.
      newSelection
    );

    // pass the selection back
    onChange && onChange(newSelection);
  };

  // console.log("items:", items, "\nselectedGroups:", selectedGroups, "\nselection:", selection);

  return (
    <FormControl sx={{ m: 1, width: "100%" }} {...props}>
      <InputLabel id="multiple-chip-label">{label}</InputLabel>
      <Select
        labelId="multiple-chip-label"
        id="multiple-chip"
        multiple
        value={selection != null ? selection : []}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label={label} />}
        renderValue={(selectedGroupIds) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selectedGroupIds.map((groupId) => {
              console.log("render chip:", groupId);
              const result = items && items.find((e) => e._id === groupId)
              return (
                <Chip
                  key={groupId}
                  label={result && result.fullName}
                />
              );
            })}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {items &&
          items.map((group) => (
            <MenuItem
              key={group._id}
              value={group._id}
              style={getStyles(group._id, selection, theme)}
            >
              {group.fullName}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}
