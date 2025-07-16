import express from 'express';
import { Request, Response } from 'express';

interface Trajet {
    utilisateurId: string;
    lieux: string[];
}

let trajets: Trajet[] = [];




const app = express();
app.use(express.json());

interface City {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface TSPRequest {
  cities: City[];
  distanceMatrix?: number[][];
}

interface TSPResult {
  minDistance: number;
  path: number[];
  executionTime: number;
}

class TSPSolver {
  private n: number;
  private dist: number[][];
  private memo: Map<string, number>;

  constructor(distanceMatrix: number[][]) {
    this.n = distanceMatrix.length;
    this.dist = distanceMatrix;
    this.memo = new Map();
  }

  // Génère toutes les combinaisons de taille k à partir d'un ensemble
  private generateCombinations(arr: number[], k: number): number[][] {
    const result: number[][] = [];
    
    const combine = (start: number, current: number[]) => {
      if (current.length === k) {
        result.push([...current]);
        return;
      }
      
      for (let i = start; i < arr.length; i++) {
        current.push(arr[i]);
        combine(i + 1, current);
        current.pop();
      }
    };
    
    combine(0, []);
    return result;
  }

  // Convertit un subset en clé pour le memoization
  private subsetToKey(subset: number[]): string {
    return subset.sort((a, b) => a - b).join(',');
  }

  // Vérifie si un subset contient la ville 1 (index 0)
  private containsCity1(subset: number[]): boolean {
    return subset.includes(0);
  }

  // Implémentation de l'algorithme TSP (Held-Karp)
  solve(): TSPResult {
    const startTime = Date.now();
    
    // C({1}, 1) = 0
    this.memo.set('0', 0);
    
    // Pour chaque taille de subset de 2 à n
    for (let s = 2; s <= this.n; s++) {
      const cities = Array.from({length: this.n}, (_, i) => i);
      const subsets = this.generateCombinations(cities, s);
      
      // Pour tous les subsets S de taille s contenant la ville 1
      for (const subset of subsets) {
        if (!this.containsCity1(subset)) continue;
        
        const subsetKey = this.subsetToKey(subset);
        
        // C(S, 1) = ∞ pour j = 1
        if (s > 1) {
          // Pour tous les j ∈ S et j ≠ 1
          for (const j of subset) {
            if (j === 0) continue; // j ≠ 1 (ville 1 = index 0)
            
            let minCost = Infinity;
            
            // C(S, j) = min{C(S - {j}, i) + d(i, j) pour i ∈ S et i ≠ j}
            const subsetWithoutJ = subset.filter(city => city !== j);
            const subsetWithoutJKey = this.subsetToKey(subsetWithoutJ);
            
            for (const i of subsetWithoutJ) {
              const prevStateKey = `${subsetWithoutJKey}-${i}`;
              const prevCost = this.memo.get(prevStateKey) || 0;
              const cost = prevCost + this.dist[i][j];
              minCost = Math.min(minCost, cost);
            }
            
            const currentStateKey = `${subsetKey}-${j}`;
            this.memo.set(currentStateKey, minCost);
          }
        }
      }
    }
    
    // Retourner min_j C({1, 2, 3, ..., n}, j) + d(j, 1)
    const allCities = Array.from({length: this.n}, (_, i) => i);
    const allCitiesKey = this.subsetToKey(allCities);
    
    let minFinalCost = Infinity;
    let lastCity = -1;
    
    for (let j = 1; j < this.n; j++) {
      const stateKey = `${allCitiesKey}-${j}`;
      const cost = (this.memo.get(stateKey) || 0) + this.dist[j][0];
      if (cost < minFinalCost) {
        minFinalCost = cost;
        lastCity = j;
      }
    }
    
    // Reconstruire le chemin
    const path = this.reconstructPath(lastCity);
    
    const executionTime = Date.now() - startTime;
    
    return {
      minDistance: minFinalCost,
      path: path,
      executionTime: executionTime
    };
  }

  private reconstructPath(lastCity: number): number[] {
    const path: number[] = [0]; // Commence par la ville 1 (index 0)
    let currentSubset = Array.from({length: this.n}, (_, i) => i);
    let currentCity = lastCity;
    
    while (currentSubset.length > 1) {
      path.push(currentCity);
      
      // Trouve la ville précédente
      const subsetWithoutCurrent = currentSubset.filter(city => city !== currentCity);
      const subsetKey = this.subsetToKey(currentSubset);
      const currentStateKey = `${subsetKey}-${currentCity}`;
      const currentCost = this.memo.get(currentStateKey) || 0;
      
      let prevCity = -1;
      for (const i of subsetWithoutCurrent) {
        const prevStateKey = `${this.subsetToKey(subsetWithoutCurrent)}-${i}`;
        const prevCost = this.memo.get(prevStateKey) || 0;
        if (Math.abs((prevCost + this.dist[i][currentCity]) - currentCost) < 1e-9) {
          prevCity = i;
          break;
        }
      }
      
      currentSubset = subsetWithoutCurrent;
      currentCity = prevCity;
      
      if (currentSubset.length === 1) break;
    }
    
    path.push(0); // Retourne à la ville 1
    return path;
  }
}

// Fonction pour calculer la distance euclidienne
function calculateDistance(city1: City, city2: City): number {
  const dx = city1.x - city2.x;
  const dy = city1.y - city2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Génère une matrice de distances à partir des coordonnées
function generateDistanceMatrix(cities: City[]): number[][] {
  const n = cities.length;
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        matrix[i][j] = calculateDistance(cities[i], cities[j]);
      }
    }
  }
  
  return matrix;
}

// Route pour résoudre le TSP
app.post('/tsp/solve', (req, res) => {
  try {
    const { cities, distanceMatrix }: TSPRequest = req.body;
    
    if (!cities || cities.length < 2) {
      return res.status(400).json({
        error: 'Au moins 2 villes sont requises'
      });
    }
    
    if (cities.length > 15) {
      return res.status(400).json({
        error: 'Trop de villes (max 15 pour des performances raisonnables)'
      });
    }
    
    // Utilise la matrice fournie ou génère une basée sur les coordonnées
    const matrix = distanceMatrix || generateDistanceMatrix(cities);
    
    if (matrix.length !== cities.length) {
      return res.status(400).json({
        error: 'La matrice de distances doit correspondre au nombre de villes'
      });
    }
    
    const solver = new TSPSolver(matrix);
    const result = solver.solve();
    
    // Convertit les indices en noms de villes
    const pathWithNames = result.path.map(index => ({
      index: index,
      name: cities[index].name
    }));
    
    res.json({
      ...result,
      pathWithNames: pathWithNames,
      totalCities: cities.length
    });
    
  } catch (error) {
    console.error('Erreur lors de la résolution TSP:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour tester avec des données d'exemple
app.get('/tsp/example', (req, res) => {
  const exampleCities: City[] = [
    { id: 1, name: 'Paris', x: 0, y: 0 },
    { id: 2, name: 'Lyon', x: 4, y: 3 },
    { id: 3, name: 'Marseille', x: 7, y: 1 },
    { id: 4, name: 'Toulouse', x: 2, y: 6 },
    { id: 5, name: 'Lille', x: 1, y: 8 }
  ];
  
  const solver = new TSPSolver(generateDistanceMatrix(exampleCities));
  const result = solver.solve();
  
  const pathWithNames = result.path.map(index => ({
    index: index,
    name: exampleCities[index].name
  }));
  
  res.json({
    ...result,
    pathWithNames: pathWithNames,
    cities: exampleCities,
    totalCities: exampleCities.length
  });
});

// Route d'information
app.get('/tsp/info', (req, res) => {
  res.json({
    algorithm: 'Held-Karp Dynamic Programming',
    timeComplexity: 'O(n² * 2^n)',
    spaceComplexity: 'O(n * 2^n)',
    maxRecommendedCities: 15,
    description: 'Résout le problème du voyageur de commerce de manière exacte'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur TSP démarré sur le port ${PORT}`);
  console.log(`📍 API disponible sur:`);
  console.log(`   POST /tsp/solve - Résoudre TSP`);
  console.log(`   GET  /tsp/example - Exemple avec 5 villes`);
  console.log(`   GET  /tsp/info - Information sur l'algorithme`);
});

export default app;



export const ajouterTrajet = (req: Request, res: Response) => {
    const { utilisateurId, lieux } = req.body;
    if (!utilisateurId || !Array.isArray(lieux)) {
        return res.status(400).json({ message: 'Paramètres invalides' });
    }
    const trajet: Trajet = { utilisateurId, lieux };
    trajets.push(trajet);
    res.status(201).json(trajet);
};

export const listerTrajets = (req: Request, res: Response) => {
    const { utilisateurId } = req.query;
    if (utilisateurId) {
        const result = trajets.filter(t => t.utilisateurId === utilisateurId);
        return res.json(result);
    }
    res.json(trajets);
};

export const supprimerTrajet = (req: Request, res: Response) => {
    const { utilisateurId, index } = req.body;
    if (!utilisateurId || typeof index !== 'number') {
        return res.status(400).json({ message: 'Paramètres invalides' });
    }
    const trajetsUtilisateur = trajets.filter(t => t.utilisateurId === utilisateurId);
    if (index < 0 || index >= trajetsUtilisateur.length) {
        return res.status(404).json({ message: 'Trajet non trouvé' });
    }
    const trajetASupprimer = trajetsUtilisateur[index];
    trajets = trajets.filter(t => t !== trajetASupprimer);
    res.json({ message: 'Trajet supprimé' });
};
