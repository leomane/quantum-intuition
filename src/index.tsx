/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import App from './App.tsx';
import { initAuth } from './stores/auth';
import { initProgress } from './stores/progress';

// Bootstrap auth → then load saved progress
initAuth();
initProgress();

const root = document.getElementById('root');

render(() => <App />, root!);
