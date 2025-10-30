// Game logic separated from template

export interface GameData {
    id: string;
    title: string;
    levels: GameLevel[];
}

export interface GameLevel {
    level: number;
    categories?: Category[];
    final?: {
        question: string;
        answer: string;
        value: number;
    };
}

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

export class JeopardyGame {
    private gameData: GameData | null = null;
    private currentLevelIndex: number = 0;
    private revealState: 'question' | 'answer' = 'question';

    constructor(gameData: GameData | null) {
        this.gameData = gameData || this.buildSampleGame();
        this.currentLevelIndex = 0;
    }

    buildSampleGame(): GameData {
        const baseValuesL1 = [100, 200, 300, 400, 500];
        const baseValuesL2 = [200, 400, 600, 800, 1000];
        return {
            id: 'sample',
            title: "Sample Jeopardy",
            levels: [
                {
                    level: 1,
                    categories: Array.from({ length: 5 }).map((_, c) => ({
                        name: `Category ${c + 1}`,
                        questions: baseValuesL1.map((v) => ({
                            value: v,
                            question: `Sample Question $${v}`,
                            answer: `Sample Answer $${v}`,
                        })),
                    })),
                },
                {
                    level: 2,
                    categories: Array.from({ length: 5 }).map((_, c) => ({
                        name: `Category ${c + 1}+`,
                        questions: baseValuesL2.map((v) => ({
                            value: v,
                            question: `Sample Question $${v}`,
                            answer: `Sample Answer $${v}`,
                        })),
                    })),
                },
                {
                    level: 3,
                    final: {
                        question: "Final: Sample Final",
                        answer: "Sample Answer",
                        value: 2000,
                    },
                },
            ],
        };
    }

    getCurrentLevel(): GameLevel | null {
        return this.gameData?.levels[this.currentLevelIndex] || null;
    }

    getGameData(): GameData {
        return this.gameData!;
    }

    advanceLevel(): boolean {
        if (this.currentLevelIndex < this.gameData!.levels.length - 1) {
            this.currentLevelIndex += 1;
            return true;
        }
        return false;
    }

    markQuestionUsed(categoryIndex: number, questionIndex: number): void {
        const level = this.getCurrentLevel();
        if (level?.categories) {
            level.categories[categoryIndex].questions[questionIndex].used = true;
        }
    }

    checkLevelComplete(): boolean {
        const level = this.getCurrentLevel();
        if (!level?.categories) return false;
        return level.categories.every((cat) =>
            cat.questions.every((q) => q.used),
        );
    }

    getQuestion(categoryIndex: number, questionIndex: number): Question | null {
        const level = this.getCurrentLevel();
        if (!level?.categories) return null;
        return level.categories[categoryIndex]?.questions[questionIndex] || null;
    }

    resetRevealState(): void {
        this.revealState = 'question';
    }

    getRevealState(): 'question' | 'answer' {
        return this.revealState;
    }

    setRevealState(state: 'question' | 'answer'): void {
        this.revealState = state;
    }
}
