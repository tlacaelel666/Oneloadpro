// bayesian-advanced-analytics.js

// Módulo de Seguridad y Validación
const SecurityUtils = {
    sanitizeInput(input) {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    validateNumericArray(data) {
        return Array.isArray(data) && 
               data.length > 0 && 
               data.every(x => typeof x === 'number' && !isNaN(x));
    }
};

// Generador de Ruido Avanzado
class NoiseGenerator {
    static gaussian(amplitude, frequency, phase, points = 50) {
        return Array.from({length: points}, (_, i) => 
            amplitude * Math.sin(frequency * i + phase) + 
            (Math.random() * 2 - 1) * 0.2
        );
    }

    static perlin(amplitude, frequency, phase, points = 50) {
        // Implementación simplificada de ruido Perlin
        const noise = this.gaussian(amplitude, frequency / 5, phase, points);
        return noise.map((value, i, arr) => 
            i > 0 && i < arr.length - 1 
                ? (arr[i-1] + value + arr[i+1]) / 3 
                : value
        );
    }

    static uniform(amplitude, points = 50) {
        return Array.from({length: points}, () => 
            (Math.random() * 2 - 1) * amplitude
        );
    }
}

// Clase de Análisis Bayesiano Avanzado
class AdvancedBayesAnalytics {
    constructor(config = {}) {
        this.config = {
            entropyWeight: 0.4,
            coherenceWeight: 0.3,
            prnInfluenceWeight: 0.3,
            ...config
        };
        this.dataStore = new Map();
    }

    // Cálculo de Entropía de Shannon
    shannonEntropy(data) {
        if (!SecurityUtils.validateNumericArray(data)) {
            throw new Error('Datos inválidos para cálculo de entropía');
        }

        const total = data.length;
        const counts = data.reduce((acc, value) => {
            acc.set(value, (acc.get(value) || 0) + 1);
            return acc;
        }, new Map());

        return -Array.from(counts.values()).reduce((entropy, count) => {
            const probability = count / total;
            return entropy + (probability * Math.log2(probability));
        }, 0);
    }

    // Cálculo de Factor de Bayes
    calculateBayesFactor(data) {
        if (!SecurityUtils.validateNumericArray(data)) {
            throw new Error('Datos inválidos para Factor de Bayes');
        }

        const bayesFactor = Math.abs(
            data.reduce((a, b) => a + b, 0) / data.length
        );

        const interpretations = [
            { threshold: 1, text: 'Evidencia anecdótica' },
            { threshold: 3, text: 'Evidencia sustancial' },
            { threshold: 10, text: 'Evidencia fuerte' },
            { threshold: Infinity, text: 'Evidencia decisiva' }
        ];

        const interpretation = interpretations.find(
            item => bayesFactor < item.threshold
        ).text;

        return { 
            bayesFactor, 
            interpretation,
            entropy: this.shannonEntropy(data)
        };
    }

    // Inferencia Bayesiana Probabilística
    bayesianInference(priors, likelihoods) {
        const posteriors = {...priors};
        
        for (const evidence of likelihoods) {
            const total = Object.keys(posteriors).reduce((sum, hypothesis) => {
                return sum + (posteriors[hypothesis] * evidence[hypothesis]);
            }, 0);
            
            for (const hypothesis in posteriors) {
                posteriors[hypothesis] = 
                    (posteriors[hypothesis] * evidence[hypothesis]) / total;
            }
        }

        return posteriors;
    }

    // Cálculo de Probabilidades Ponderadas
    calculateProbabilities(entropy, coherence, prnInfluence, currentAction) {
        const { entropyWeight, coherenceWeight, prnInfluenceWeight } = this.config;

        // Normalizar valores
        const normalizedEntropy = Math.max(0, Math.min(1, entropy));
        const normalizedCoherence = Math.max(0, Math.min(1, coherence));
        const normalizedPrnInfluence = Math.max(0, Math.min(1, prnInfluence));

        // Calcular probabilidad ponderada
        const weightedProb = (
            entropyWeight * normalizedEntropy + 
            coherenceWeight * normalizedCoherence + 
            prnInfluenceWeight * normalizedPrnInfluence
        );

        // Determinar acción recomendada
        const recommendedAction = weightedProb > 0.5 ? 1 : 0;
        
        // Calcular confianza
        const confidence = Math.abs(weightedProb - 0.5) * 2;

        return {
            weightedProbability: weightedProb,
            recommendedAction,
            confidence,
            params: {
                entropy: normalizedEntropy,
                coherence: normalizedCoherence,
                prnInfluence: normalizedPrnInfluence
            }
        };
    }

    // Persistencia de Resultados
    storeResult(type, result) {
        const timestamp = new Date().toISOString();
        const id = `${type}_${timestamp}`;
        
        this.dataStore.set(id, {
            type,
            result,
            timestamp
        });

        // Opcional: Limitar almacenamiento
        if (this.dataStore.size > 100) {
            const oldestKey = this.dataStore.keys().next().value;
            this.dataStore.delete(oldestKey);
        }

        return id;
    }

    // Recuperar resultados almacenados
    getStoredResults(type = null) {
        if (type) {
            return Array.from(this.dataStore.entries())
                .filter(([_, entry]) => entry.type === type);
        }
        return Array.from(this.dataStore.entries());
    }
}

// Clase de Visualización de Datos
class DataVisualizer {
    constructor(chartLibrary = Chart) {
        this.chartLibrary = chartLibrary;
        this.charts = new Map();
    }

    createNoiseChart(canvasId, data, config = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destruir gráfico existente si lo hay
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }

        const defaultConfig = {
            type: 'line',
            data: {
                labels: data.map((_, i) => i),
                datasets: [{
                    label: 'Ruido Generado',
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Generación de Ruido'
                    }
                }
            }
        };

        const mergedConfig = { ...defaultConfig, ...config };
        const chart = new this.chartLibrary(ctx, mergedConfig);
        
        this.charts.set(canvasId, chart);
        return chart;
    }

    createInferenceChart(canvasId, priors, posteriors) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destruir gráfico existente
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }

        const chart = new this.chartLibrary(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(priors),
                datasets: [
                    {
                        label: 'Probabilidades Previas',
                        data: Object.values(priors),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Probabilidades Posteriores',
                        data: Object.values(posteriors),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });

        this.charts.set(canvasId, chart);
        return chart;
    }
}

// Exportar módulos para uso modular
export {
    SecurityUtils,
    NoiseGenerator,
    AdvancedBayesAnalytics,
    DataVisualizer
};

// Ejemplo de uso (comentado para no interferir con la implementación)
/*
document.addEventListener('DOMContentLoaded', () => {
    const analytics = new AdvancedBayesAnalytics();
    const visualizer = new DataVisualizer();

    // Ejemplo de cálculo de Factor de Bayes
    try {
        const bayesResult = analytics.calculateBayesFactor([0.1, 0.2, 0.3, 0.4]);
        console.log(bayesResult);
    } catch (error) {
        console.error('Error en cálculo de Factor de Bayes:', error);
    }

    // Ejemplo de generación de ruido
    const noiseData = NoiseGenerator.gaussian(1, 1, 0);
    visualizer.createNoiseChart('noiseChart', noiseData);
});
*/
