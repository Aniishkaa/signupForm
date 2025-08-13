import { renderToString } from '@builder.io/qwik/server';
import App from './root';

export default function () {
  return renderToString(<App />);
}