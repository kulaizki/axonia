import { writable, derived, get } from 'svelte/store';
import { Niivue, type Niivue as NiivueInstance } from '@niivue/niivue';

type NiivueState = {
  instance: NiivueInstance | null;
  isInitialized: boolean; // Has the instance been created?
  isLoading: boolean; // Is it currently loading a file?
  isReady: boolean; // Is the viewer ready to be used (initialized and not loading)?
  errorMessage: string;
  currentFile: string | null;
  sliceType: number;
  selectedColormap: string;
};

// Default values
const initialState: NiivueState = {
  instance: null,
  isInitialized: false,
  isLoading: false, // Nothing is loading initially
  isReady: false,
  errorMessage: '',
  currentFile: null,
  sliceType: 3, // Multiplanar view
  selectedColormap: 'inferno'
};

// Create the writable store
const createNiivueStore = () => {
  const { subscribe, set, update } = writable<NiivueState>(initialState);

  // Get the current instance without subscribing
  const getInstance = (): NiivueInstance | null => get({ subscribe }).instance;
  
  const storeMethods = {
    subscribe,
    
    // Initialize NiiVue instance
    initializeNiivue: (canvas: HTMLCanvasElement) => {
      update((state) => ({ ...state, isLoading: true }));
      
      // Defer the creation to allow the canvas to be fully ready
      setTimeout(() => {
        try {
          const nv = new Niivue({
            backColor: [0.15, 0.15, 0.15, 1],
            colorbarHeight: 0.05,
            dragMode: 1, // Contrast
            multiplanarForceRender: true,
            isResizeCanvas: true,
          });
          nv.attachToCanvas(canvas);

          update((state) => ({ 
            ...state, 
            instance: nv, 
            isInitialized: true, 
            errorMessage: '' 
          }));

        } catch (error) {
          console.error('Failed to initialize Niivue:', error);
          update((state) => ({
            ...state,
            instance: null,
            isInitialized: false,
            isLoading: false,
            isReady: false,
            errorMessage: 'Error initializing the viewer. Please refresh.'
          }));
        }
      }, 0); // A 0ms timeout defers execution until after the current stack clears
    },

    // Clean up NiiVue instance
    destroyNiivue: () => {
      update((state) => {
        if (state.instance && typeof (state.instance as any).destroy === 'function') {
          try {
            (state.instance as any).destroy();
          } catch (e) {
            console.error('Error calling Niivue destroy method:', e);
          }
        }
        return { ...initialState }; // Reset fully
      });
    },

    // A helper to wait for initialization
    waitForInitialization: async (): Promise<NiivueInstance | null> => {
      const MAX_WAIT_TIME = 5000; // 5 seconds
      const PULL_INTERVAL = 50; // 50 ms
      let waited = 0;

      while (waited < MAX_WAIT_TIME) {
        const state = get({ subscribe });
        if (state.isInitialized && state.instance) {
          return state.instance;
        }
        await new Promise(resolve => setTimeout(resolve, PULL_INTERVAL));
        waited += PULL_INTERVAL;
      }
      
      console.error("Timeout: NiiVue instance not initialized in time.");
      update(state => ({ ...state, errorMessage: "Viewer failed to initialize in time."}));
      return null;
    },

    // Load a default sample file
    loadDefaultFile: async () => {
      const nv = await storeMethods.waitForInitialization();
      if (!nv) {
        update((state) => ({
          ...state,
          errorMessage: 'NiiVue viewer is not ready. Please wait or refresh.'
        }));
        return;
      }
      
      update((state) => ({
        ...state,
        isLoading: true,
        errorMessage: '',
        currentFile: 'sample_brain.nii.gz (sample)'
      }));

      try {
        // It's safer to create a new volume object
        const volume = {
          url: './sample_brain.nii.gz',
          colormap: get({ subscribe }).selectedColormap
        };
        await nv.loadVolumes([volume]);
        update((state) => ({ ...state, isLoading: false, isReady: true }));

        // Settings are now handled by onImageLoaded or are part of the volume object
        // so no need to manually set them here post-load unless necessary.
        // Slice type is a global setting, so we still set it.
        const state = get({ subscribe });
        if (state.instance) {
          const multiplanarType = typeof (state.instance as any).sliceTypeMultiplanar === 'number'
            ? (state.instance as any).sliceTypeMultiplanar
            : 3;
          
          if (state.sliceType === 3) {
            state.instance.setSliceType(multiplanarType);
          } else {
            state.instance.setSliceType(state.sliceType);
          }
        }

      } catch (error) {
        console.error('Error loading default file "sample_brain.nii.gz":', error);
        update((state) => ({
          ...state,
          isLoading: false,
          isReady: false, // Failed to load, so not ready
          currentFile: null,
          errorMessage:
            error instanceof Error
              ? `Failed to load default: ${error.message}. Check console.`
              : 'An unexpected error occurred loading default. Check console.'
        }));
      }
    },

    // Load a file from user upload
    loadFromFile: async (file: File) => {
      const nv = await storeMethods.waitForInitialization();
      if (!nv) {
        update((state) => ({
          ...state,
          errorMessage: 'NiiVue viewer is not ready. Please wait or refresh.'
        }));
        return;
      }

      update((state) => ({
        ...state,
        isLoading: true,
        errorMessage: '',
        currentFile: file.name
      }));

      try {
        const volume = {
          url: URL.createObjectURL(file),
          colormap: get({ subscribe }).selectedColormap,
          fileName: file.name,
        };

        // Ensure we clear old volumes before loading a new one
        nv.volumes = [];
        
        await nv.loadVolumes([volume]);
        update((state) => ({ ...state, isLoading: false, isReady: true }));
        
        const state = get({ subscribe });
        if (state.instance) {
          // As before, slice type is a global setting
          const multiplanarType = typeof (state.instance as any).sliceTypeMultiplanar === 'number'
            ? (state.instance as any).sliceTypeMultiplanar
            : 3;
          
          if (state.sliceType === 3) {
            state.instance.setSliceType(multiplanarType);
          } else {
            state.instance.setSliceType(state.sliceType);
          }
        }
        
      } catch (error) {
        console.error(`Error loading file "${file.name}":`, error);
        update((state) => ({
          ...state,
          isLoading: false,
          isReady: true, // Still ready, even if file fails
          currentFile: null,
          errorMessage:
            error instanceof Error
              ? `Failed to load: ${error.message}. Check console.`
              : 'An unexpected error occurred. Check console.'
        }));
      }
    },

    // Update slice type
    setSliceType: (newType: number) => {
      update((state) => {
        if (!state.instance) return state;

        try {
          const multiplanarType = typeof (state.instance as any).sliceTypeMultiplanar === 'number'
                              ? (state.instance as any).sliceTypeMultiplanar
                              : 3;
          
          if (newType === 3) {
            state.instance.setSliceType(multiplanarType);
          } else {
            state.instance.setSliceType(newType);
          }
          return { ...state, sliceType: newType, errorMessage: '' };
        } catch (e) {
          console.error("Error setting slice type:", e);
          return { ...state, errorMessage: "Failed to change view type." };
        }
      });
    },

    // Update colormap
    setColormap: (colormap: string) => {
      update((state) => {
        if (!state.instance || !state.instance.volumes || state.instance.volumes.length === 0) {
          return { ...state, selectedColormap: colormap };
        }

        try {
          state.instance.volumes[0].colormap = colormap;
          state.instance.updateGLVolume();
          return { ...state, selectedColormap: colormap, errorMessage: '' };
        } catch (e) {
          console.error("Error setting colormap:", e);
          return { ...state, errorMessage: "Failed to apply colormap." };
        }
      });
    },

    // Reset view to defaults
    resetView: () => {
      update((state) => {
        if (!state.instance) return state;

        try {
          state.instance.setDefaults();

          // Reset colormap if volume is loaded
          if (state.instance.volumes?.length > 0) {
            state.instance.volumes[0].colormap = 'inferno';
            state.instance.updateGLVolume();
          }

          // Reset slice type
          const multiplanarType =
            typeof (state.instance as any).sliceTypeMultiplanar === 'number'
              ? (state.instance as any).sliceTypeMultiplanar
              : 3;
          state.instance.setSliceType(multiplanarType);

          return {
            ...state,
            sliceType: 3,
            selectedColormap: 'inferno',
            errorMessage: ''
          };
        } catch (e) {
          console.error('Error calling nv.setDefaults():', e);
          return { ...state, errorMessage: 'Failed to reset view.' };
        }
      });
    },

    // Reset to a clean state
    reset: () => {
      set(initialState);
    }
  };
  return storeMethods;
};

// Export the store instance
export const niivueStore = createNiivueStore();

// Derived store for just the controls, to prevent unnecessary re-renders of the canvas
export const niivueControls = derived(
  niivueStore,
  ($niivueStore) => ({
    isLoading: $niivueStore.isLoading,
    isReady: $niivueStore.isReady,
    errorMessage: $niivueStore.errorMessage,
    currentFile: $niivueStore.currentFile,
    sliceType: $niivueStore.sliceType,
    selectedColormap: $niivueStore.selectedColormap
  })
);

// Export available colormaps as a constant
export const AVAILABLE_COLORMAPS = [
  'grayscale', 'negative', 'viridis', 'plasma', 'magma', 'inferno',
  'hot', 'cool', 'bone', 'pink', 'jet', 'hsv',
  'spring', 'summer', 'autumn', 'winter', 'surface'
];

const derivedReady = derived(
  niivueStore,
  ($niivueStore) => $niivueStore.isInitialized && !$niivueStore.isLoading
);

export { derivedReady }; 