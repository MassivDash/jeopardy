// Dialog management utilities for dynamically created dialog content

export interface DialogOptions {
    type: 'clue' | 'final';
    value?: number;
    question: string;
    answer: string;
    onClose?: () => void;
}

export class DialogManager {
    private dialogId: string;
    private contentId: string;
    private revealState: 'question' | 'answer' = 'question';

    constructor(dialogId = 'card', contentId = 'cardContent') {
        this.dialogId = dialogId;
        this.contentId = contentId;
    }

    open(options: DialogOptions) {
        const dlg = document.getElementById(this.dialogId) as HTMLDialogElement;
        const content = document.getElementById(this.contentId);
        if (!dlg || !content) return;

        this.revealState = 'question';
        content.innerHTML = '';

        const wrap = document.createElement('div');
        wrap.className = 'qa';

        if (options.type === 'clue' && options.value) {
            const amount = document.createElement('div');
            amount.className = 'amount';
            amount.textContent = `$${options.value}`;
            wrap.appendChild(amount);
        }

        const text = document.createElement('div');
        text.className = 'text';
        text.textContent = options.question;
        wrap.appendChild(text);

        const footer = document.createElement('div');
        footer.className = 'footer';

        const hint = document.createElement('span');
        hint.className = 'hint';
        hint.textContent = 'Click to reveal answer';
        footer.appendChild(hint);

        wrap.addEventListener('click', () => {
            if (this.revealState === 'question') {
                text.textContent = options.answer;
                hint.textContent = 'Click to close';
                this.revealState = 'answer';
            } else {
                dlg.close();
                if (typeof options.onClose === 'function') {
                    options.onClose();
                }
            }
        });

        content.appendChild(wrap);
        content.appendChild(footer);
        
        if (!dlg.open) {
            dlg.showModal();
        }
    }

    close() {
        const dlg = document.getElementById(this.dialogId) as HTMLDialogElement;
        if (dlg && dlg.open) {
            dlg.close();
        }
    }
}
