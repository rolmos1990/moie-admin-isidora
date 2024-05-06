import InputSearchField from "./InputSearchField";
import InputSwitchField from "./InputSwitchField";
import {EmailField, NumberDecimalField, NumberField, TextAlphaField, TextField} from './InputTextField';
import InputDate from "./InputDate";
import InputPhoneField from "./InputPhoneField";
import InputAsyncSearchField from "./InputAsyncSearchField";
import InputSelectBasicField from "./InputSelectBasicField";

const FieldAsyncSelect = InputAsyncSearchField;
const FieldSelectBasic = InputSelectBasicField;
const FieldSelect = InputSearchField;
const FieldSwitch = InputSwitchField;
const FieldText = TextField;
const FieldAlphaText = TextAlphaField;
const FieldNumber = NumberField;
const FieldDecimalNumber = NumberDecimalField;
const FieldEmail = EmailField;
const FieldDate = InputDate;
const FieldPhone = InputPhoneField;

export {
    FieldSwitch,
    FieldAsyncSelect,
    FieldSelectBasic,
    FieldSelect,
    FieldText,
    FieldNumber,
    FieldDecimalNumber,
    FieldEmail,
    FieldDate,
    FieldPhone,
    FieldAlphaText
};
