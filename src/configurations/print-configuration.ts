import { styleText } from 'node:util';

interface PrintProps {
  format: Parameters<typeof styleText>[0];
  message: Parameters<typeof styleText>[1];
}

function print(props: PrintProps) {
  console.log(styleText(props.format, props.message));
}

export default print;
