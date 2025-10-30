// Board rendering utilities that use proper DOM structure

export interface Category {
    name: string;
    questions: Question[];
}

export interface Question {
    value: number;
    question: string;
    answer: string;
    used?: boolean;
}

export interface Level {
    level: number;
    categories?: Category[];
    final?: {
        question: string;
        answer: string;
        value: number;
    };
}

export class BoardRenderer {
    private boardId: string;
    private onCellClick: (categoryIndex: number, questionIndex: number) => void;
    private onFinalClick: () => void;

    constructor(
        boardId: string,
        onCellClick: (categoryIndex: number, questionIndex: number) => void,
        onFinalClick: () => void
    ) {
        this.boardId = boardId;
        this.onCellClick = onCellClick;
        this.onFinalClick = onFinalClick;
    }

    render(level: Level) {
        const board = document.getElementById(this.boardId);
        if (!board) return;

        if (level.final) {
            this.renderFinal(level.final);
            return;
        }

        if (!level.categories || level.categories.length === 0) {
            return;
        }

        const categories = level.categories;
        const cols = categories.length;
        const rows = categories[0]?.questions?.length || 0;

        board.innerHTML = '';
        board.style.setProperty('--cols', String(cols));
        board.style.setProperty('--rows', String(rows + 1));

        // Header row: category names
        categories.forEach((cat) => {
            const cell = document.createElement('div');
            cell.className = 'cell header';
            cell.textContent = cat.name;
            board.appendChild(cell);
        });

        // Question cells: fill row by row (all $100s, then all $200s, etc.)
        for (let rIdx = 0; rIdx < rows; rIdx++) {
            categories.forEach((cat, cIdx) => {
                const q = cat.questions[rIdx];
                if (!q) return;
                
                const cell = document.createElement('button');
                cell.className = 'cell value';
                if (q.used) {
                    cell.classList.add('used');
                    cell.disabled = true;
                    cell.textContent = '';
                } else {
                    cell.textContent = `$${q.value}`;
                    cell.addEventListener('click', () => this.onCellClick(cIdx, rIdx));
                }
                cell.dataset.col = String(cIdx);
                cell.dataset.row = String(rIdx);
                board.appendChild(cell);
            });
        }
    }

    private renderFinal(final: { question: string; answer: string; value: number }) {
        const board = document.getElementById(this.boardId);
        if (!board) return;

        board.innerHTML = '';
        const finalBtn = document.createElement('button');
        finalBtn.className = 'final-btn';
        finalBtn.textContent = `Final Jeopardy (${final.value})`;
        finalBtn.addEventListener('click', this.onFinalClick);
        board.appendChild(finalBtn);
    }
}
