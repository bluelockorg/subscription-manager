interface OptionObject {
  value: string;
  text: string;
}

export const dateOptions: OptionObject[] = [
  {
    value: "yyyy",
    text: "YYYY",
  },
  {
    value: "MM",
    text: "MM",
  },
  {
    value: "MMMM",
    text: "Month",
  },
  {
    value: "MMM",
    text: "Mon",
  },
  {
    value: "dd",
    text: "DD",
  },

  // {
  //   value: "",
  //   text: "None",
  // },
];

export const separatorOptions: OptionObject[] = [
  {
    value: " ",
    text: "space",
  },
  {
    value: "-",
    text: "-",
  },
  {
    value: "/",
    text: "/",
  },
  {
    value: ".",
    text: ".",
  },
  {
    value: ",",
    text: ",",
  },
];

export const separatorsRegex = new RegExp(
  `[${separatorOptions.map((option) => option.value).join("")}]`,
  "g"
);

export const optionsWithDefault = (
  options: OptionObject[],
  defaultValue?: string
) => {
  const defaultOption =
    options.find((option) => option.value === defaultValue) || options[0];
  return [
    defaultOption,
    ...options.filter((option) => option !== defaultOption),
  ];
};
