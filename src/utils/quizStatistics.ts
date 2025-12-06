// Quiz statistics management using localStorage
export interface QuizStats {
    totalGames: number;
    bestScore: number;
    totalQuestions: number;
    totalCorrectAnswers: number;
    averageScore: number;
    lastPlayed: string;
}

export class QuizStatistics {
    private static readonly STORAGE_KEY = 'holmes-quiz-stats';

    // Get current statistics
    static getStats(): QuizStats {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Could not load quiz statistics');
        }
        
        // Default stats
        return {
            totalGames: 0,
            bestScore: 0,
            totalQuestions: 0,
            totalCorrectAnswers: 0,
            averageScore: 0,
            lastPlayed: ''
        };
    }

    // Update statistics after a quiz
    static updateStats(score: number, totalQuestions: number): QuizStats {
        const currentStats = this.getStats();
        
        const newStats: QuizStats = {
            totalGames: currentStats.totalGames + 1,
            bestScore: Math.max(currentStats.bestScore, score),
            totalQuestions: currentStats.totalQuestions + totalQuestions,
            totalCorrectAnswers: currentStats.totalCorrectAnswers + score,
            averageScore: 0, // Will be calculated below
            lastPlayed: new Date().toISOString()
        };
        
        // Calculate average score
        newStats.averageScore = Math.round((newStats.totalCorrectAnswers / newStats.totalQuestions) * 100) / 100;
        
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newStats));
        } catch (e) {
            console.warn('Could not save quiz statistics');
        }
        
        return newStats;
    }

    // Reset all statistics
    static resetStats(): void {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('Could not reset quiz statistics');
        }
    }

    // Get formatted stats message
    static getStatsMessage(): string {
        const stats = this.getStats();
        
        if (stats.totalGames === 0) {
            return "📊 **Quiz-statistik**\n\nIngen quiz spelad ännu. Starta din första quiz!";
        }
        
        const averagePercentage = Math.round((stats.averageScore) * 100);
        const bestPercentage = Math.round((stats.bestScore / 10) * 100);
        
        return `📊 **Quiz-statistik**\n\n` +
               `🏆 **Bästa resultat:** ${stats.bestScore}/10 (${bestPercentage}%)\n` +
               `📈 **Genomsnitt:** ${stats.averageScore.toFixed(1)}/10 (${averagePercentage}%)\n` +
               `🎯 **Spelade quiz:** ${stats.totalGames}\n` +
               `✅ **Rätta svar totalt:** ${stats.totalCorrectAnswers}/${stats.totalQuestions}\n` +
               `📅 **Senast spelad:** ${stats.lastPlayed ? new Date(stats.lastPlayed).toLocaleDateString('sv-SE') : 'Aldrig'}`;
    }
}