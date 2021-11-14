import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

export interface FormItemProps {
  label: string;
  value: string | boolean | number;
  required?: boolean;
  type: "string" | "bool" | "number" | "select" | "text";
  description?: string;
  readOnly?: boolean;
  onChange?: (value?: string | number) => void;
  values?: string[];
}
const FormItem = (props: FormItemProps) => {
  const { t } = useTranslation();
  return (
    <FormControl shadow="md" p="2" rounded="lg" isRequired={props.required}>
      <FormLabel>{t(props.label)}</FormLabel>
      {props.type === "string" ? (
        <Input
          isReadOnly={props.readOnly}
          value={props.value as string}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e.target.value);
            }
          }}
        />
      ) : props.type === "text" ? (
        <Textarea
          isReadOnly={props.readOnly}
          value={props.value as string}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e.target.value);
            }
          }}
        />
      ) : props.type === "bool" ? (
        <Switch
          isReadOnly={props.readOnly}
          isChecked={props.value as boolean}
          onChange={() => {
            if (props.onChange) {
              props.onChange();
            }
          }}
        />
      ) : props.type === "select" ? (
        <Select
          isDisabled={props.readOnly}
          value={props.value as string}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e.target.value);
            }
          }}
        >
          <option value="">{t("select")}</option>
          {props.values?.map((key) => {
            return (
              <option key={key} value={key}>
                {t(key)}
              </option>
            );
          })}
        </Select>
      ) : props.type === "number" ? (
        <NumberInput
          defaultValue={props.value as number}
          onChange={(str, num) => {
            if (props.onChange) {
              props.onChange(num);
            }
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      ) : null}
      {props.description && (
        <FormHelperText>{t(props.description)}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormItem;
