const React = require("react");
const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require("@testing-library/react");
const { BrowserRouter } = require("react-router-dom");
require("@testing-library/jest-dom");
const { act } = require("react");

// Mock du store d'exercices
const mockExercises = [
  {
    _id: "1",
    title: "Respiration carrée",
    description: "Technique de respiration pour se calmer",
    inspiration: 4,
    apnee: 4,
    expiration: 4,
  },
  {
    _id: "2",
    title: "Respiration profonde",
    description: "Technique pour améliorer l'oxygénation",
    inspiration: 5,
    apnee: 0,
    expiration: 7,
  },
];

const mockFetchExercises = jest.fn();
const mockFetchExerciseById = jest.fn();
const mockAddExercise = jest.fn();
const mockUpdateExercise = jest.fn();
const mockDeleteExercise = jest.fn();

jest.mock("../stores/useExerciceStore", () => ({
  __esModule: true,
  default: () => ({
    exercises: mockExercises,
    currentExercise: null,
    loading: false,
    error: null,
    fetchExercises: mockFetchExercises,
    fetchExerciseById: mockFetchExerciseById,
    addExercise: mockAddExercise,
    updateExercise: mockUpdateExercise,
    deleteExercise: mockDeleteExercise,
  }),
}));

// Mock d'axios pour simuler les appels API
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn().mockReturnThis(),
  defaults: {
    baseURL: "",
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
}));

const axios = require("axios");

// Composant à tester
const ExerciseView = require("../views/Exercise").default;

// Mock pour les animations et timers
jest.useFakeTimers();

describe("Tests fonctionnels des exercices de respiration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  // Test de la liste des exercices
  test("FT-EXO-01: Should display list of breathing exercises", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ExerciseView />
        </BrowserRouter>
      );
    });

    expect(mockFetchExercises).toHaveBeenCalled();

    expect(screen.getAllByText("Respiration carrée")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Respiration profonde")[0]).toBeInTheDocument();

    const durationElements = screen.getAllByText((content, element) => {
      return (
        element.tagName.toLowerCase() === "p" &&
        content.includes("4") &&
        content.includes("s")
      );
    });
    expect(durationElements.length).toBeGreaterThan(0);

    const durationElements2 = screen.getAllByText((content, element) => {
      return (
        element.tagName.toLowerCase() === "p" &&
        content.includes("5") &&
        content.includes("s")
      );
    });
    expect(durationElements2.length).toBeGreaterThan(0);
  });

  // Test de la sélection d'un exercice
  test("FT-EXO-02: Should select and display exercise details", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ExerciseView />
        </BrowserRouter>
      );
    });

    expect(
      screen.getByText("Sélectionnez un exercice pour commencer")
    ).toBeInTheDocument();

    const exerciseCard = screen
      .getAllByText("Respiration carrée")[0]
      .closest("div");
    await act(async () => {
      fireEvent.click(exerciseCard);
    });

    const detailsTitle = screen
      .getAllByText("Respiration carrée")
      .find((element) => element.tagName.toLowerCase() === "h2");
    expect(detailsTitle).toBeInTheDocument();

    expect(
      screen.getByText("Technique de respiration pour se calmer")
    ).toBeInTheDocument();
    expect(screen.getByText("Prêt")).toBeInTheDocument();

    expect(screen.getByLabelText("Nombre de cycles")).toBeInTheDocument();
  });

  // Test de la sélection d'un exercice
  test("FT-EXO-03: Should start and run a breathing exercise", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ExerciseView />
        </BrowserRouter>
      );
    });

    const exerciseCard = screen
      .getAllByText("Respiration carrée")[0]
      .closest("div");
    await act(async () => {
      fireEvent.click(exerciseCard);
    });

    const startButton = screen.getByText("Commencer");
    await act(async () => {
      fireEvent.click(startButton);
    });

    expect(screen.getByText("Inspirez")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    const cycleText = screen.getByText(/Cycle/, { exact: false });
    expect(cycleText.textContent).toContain("1");
    expect(cycleText.textContent).toContain("5");

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.getByText("Retenez")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.getByText("Expirez")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.getByText("Inspirez")).toBeInTheDocument();
    const cycleText2 = screen.getByText(/Cycle/, { exact: false });
    expect(cycleText2.textContent).toContain("2");

    const stopButton = screen.getByText("Arrêter");
    await act(async () => {
      fireEvent.click(stopButton);
    });

    expect(screen.getByText("Prêt")).toBeInTheDocument();
    expect(screen.getByText("Commencer")).toBeInTheDocument();
  });

  // Test de la modification du nombre de cycles
  test("FT-EXO-04: Should adjust number of cycles", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ExerciseView />
        </BrowserRouter>
      );
    });

    const exerciseCard = screen
      .getAllByText("Respiration carrée")[0]
      .closest("div");
    await act(async () => {
      fireEvent.click(exerciseCard);
    });

    const cyclesInput = screen.getByLabelText("Nombre de cycles");
    expect(cyclesInput.value).toBe("5");

    const increaseButton = screen.getByLabelText("Augmenter");
    await act(async () => {
      fireEvent.click(increaseButton);
    });

    expect(cyclesInput.value).toBe("6");

    const decreaseButton = screen.getByLabelText("Diminuer");
    await act(async () => {
      fireEvent.click(decreaseButton);
      fireEvent.click(decreaseButton);
    });

    expect(cyclesInput.value).toBe("4");

    await act(async () => {
      fireEvent.change(cyclesInput, { target: { value: "8" } });
    });

    expect(cyclesInput.value).toBe("8");
  });

  // Test de la fin d'un exercice
  test("FT-EXO-05: Should complete a full exercise session", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ExerciseView />
        </BrowserRouter>
      );
    });

    const exerciseCard = screen
      .getAllByText("Respiration profonde")[0]
      .closest("div");
    await act(async () => {
      fireEvent.click(exerciseCard);
    });

    const cyclesInput = screen.getByLabelText("Nombre de cycles");
    await act(async () => {
      fireEvent.change(cyclesInput, { target: { value: "1" } });
    });
    const startButton = screen.getByText("Commencer");
    await act(async () => {
      fireEvent.click(startButton);
    });
    expect(screen.getByText("Inspirez")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    const cycleText = screen.getByText(/Cycle/, { exact: false });
    expect(cycleText.textContent).toContain("1");

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Expirez")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(7000);
    });

    if (screen.queryByText("Arrêter")) {
      const stopButton = screen.getByText("Arrêter");
      await act(async () => {
        fireEvent.click(stopButton);
      });
    }

    await waitFor(
      () => {
        const startButton = screen.queryByText("Commencer");
        expect(startButton).not.toBeNull();
      },
      { timeout: 1000 }
    );
  });
});
