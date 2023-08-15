import blessed from 'blessed';
import { notification } from '../events.js';
import { screen } from './index.js';
export default function createNotificationBox() {
    const notificationBox = blessed.textbox({
        value: ` No notification`,
        border: "line",
        height: 3,
        width: '40%',
        right: 0,
        bottom: 0,
        style: {
            fg: 'white',
            boder: {
                fg: 'white'
            }
        }
    });
    // display notification
    notification.on('success', function (msg) {
        notificationBox.value = msg;
        notificationBox.style.fg = 'green';
        notificationBox.style.border.fg = 'green';
        screen.render();
    });
    notification.on('alert', function (msg) {
        notificationBox.value = msg;
        notificationBox.style.fg = 'yellow';
        notificationBox.style.border.fg = 'yellow';
        screen.render();
    });
    notification.on('error', function (msg) {
        notificationBox.value = msg;
        notificationBox.style.fg = 'red';
        notificationBox.style.border.fg = 'red';
        screen.render();
    });
    return notificationBox;
}
