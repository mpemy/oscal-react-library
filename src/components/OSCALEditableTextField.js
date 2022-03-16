import React, { useRef, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Grid, TextField } from "@material-ui/core";
import OSCALEditableFieldActions, {
  getElementLabel,
} from "./OSCALEditableFieldActions";

function inEditStateTextField(props, reference) {
  return (
    <Grid item xs={props.size} className={props.className}>
      <Typography>
        <TextField
          fullWidth
          inputProps={{
            "data-testid": `textField-${getElementLabel(props.editedField)}`,
          }}
          inputRef={reference}
          size={props.textFieldSize}
          defaultValue={props.value}
          variant={props.textFieldVariant}
        />
      </Typography>
    </Grid>
  );
}

function textFieldWithEditableActions(
  props,
  reference,
  inEditState,
  setInEditState
) {
  return inEditState ? (
    <>
      {inEditStateTextField(props, reference)}
      <Grid item>
        <OSCALEditableFieldActions
          inEditState={inEditState}
          editedField={props.editedField}
          editIcon={props.editIcon}
          setInEditState={setInEditState}
          onFieldSave={props.onFieldSave}
          restData={props.restData}
          reference={reference}
        />
      </Grid>
    </>
  ) : (
    <>
      <Grid item className={props.className}>
        <Typography variant={props.typographyVariant}>{props.value}</Typography>
      </Grid>
      <Grid item>
        <OSCALEditableFieldActions
          editIcon={props.editIcon}
          editedField={props.editedField}
          inEditState={inEditState}
          restData={props.restData}
          setInEditState={setInEditState}
        />
      </Grid>
    </>
  );
}

export default function OSCALEditableTextField(props) {
  const reference = useRef("reference to text field");
  const [inEditState, setInEditState] = useState(false);

  return props.canEdit ? (
    textFieldWithEditableActions(props, reference, inEditState, setInEditState)
  ) : (
    <Grid item className={props.className}>
      <Typography variant={props.typographyVariant}>{props.value}</Typography>
    </Grid>
  );
}

OSCALEditableTextField.defaultProps = {
  textFieldVariant: "outlined",
};
