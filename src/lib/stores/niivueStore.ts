import { writable, derived, get } from 'svelte/store';
import { Niivue } from '@niivue/niivue';

type NiivueState = {
  instance: Niivue | null;
  isLoading: boolean;
  errorMessage: string;
  currentFile: string | null;
  sliceType: number;
  selectedColormap: string;
};

// Default values
const initialState: NiivueState = {
  instance: null,
  isLoading: false,
  errorMessage: '',
  currentFile: null,
  sliceType: 3, // Multiplanar view
  selectedColormap: 'inferno'
};

// Create the writable store
const createNiivueStore = () => {
  const { subscribe, set, update } = writable<NiivueState>(initialState);

  // Get the current instance without subscribing
  const getInstance = (): Niivue | null => get({ subscribe }).instance;

  return {
    subscribe,
    
    // Initialize NiiVue instance
    initializeNiivue: (canvas: HTMLCanvasElement) => {
      update(state => {
        try {
          const nv = new Niivue({
            backColor: [0.15, 0.15, 0.15, 1],
            colorbarHeight: 0.05,
            dragMode: 1,
            multiplanarForceRender: true,
            isResizeCanvas: true
          });
          nv.attachToCanvas(canvas);
          return { ...state, instance: nv, errorMessage: '' };
        } catch (error) {
          console.error("Failed to initialize Niivue:", error);
          return { 
            ...state, 
            instance: null, 
            errorMessage: "Error initializing the viewer. Please refresh." 
          };
        }
      });
    },

    // Clean up NiiVue instance
    destroyNiivue: () => {
      update(state => {
        if (state.instance && typeof (state.instance as any).destroy === 'function') {
          try {
            (state.instance as any).destroy();
          } catch (e) {
            console.error("Error calling Niivue destroy method:", e);
          }
        }
        return { ...state, instance: null };
      });
    },

    // Load a default sample file
    loadDefaultFile: async () => {
      const nv = getInstance();
      if (!nv) {
        update(state => ({ 
          ...state, 
          errorMessage: "NiiVue viewer is not ready. Please wait or refresh." 
        }));
        return;
      }

      update(state => ({ 
        ...state, 
        isLoading: true, 
        errorMessage: '',
        currentFile: 'sample_brain.nii.gz (sample)'
      }));

      try {
        await nv.loadVolumes([{ url: './sample_brain.nii.gz' }]);
        const state = get({ subscribe });
        
        // Apply settings after load
        if (state.instance) {
          // Update slice type
          try {
            const multiplanarType = typeof (state.instance as any).sliceTypeMultiplanar === 'number'
                                ? (state.instance as any).sliceTypeMultiplanar
                                : 3;
            
            if (state.sliceType === 3) {
              state.instance.setSliceType(multiplanarType);
            } else {
              state.instance.setSliceType(state.sliceType);
            }
          } catch (e) {
            console.error("Error setting slice type:", e);
            update(s => ({ ...s, errorMessage: "Failed to change view type." }));
          }

          // Apply colormap
          try {
            if (state.instance.volumes && state.instance.volumes.length > 0) {
              state.instance.volumes[0].colormap = state.selectedColormap;
              state.instance.updateGLVolume();
            }
          } catch (e) {
            console.error("Error applying colormap:", e);
            update(s => ({ ...s, errorMessage: "Failed to apply colormap." }));
          }
        }

        update(state => ({ ...state, isLoading: false }));
      } catch (error) {
        console.error('Error loading default file "sample_brain.nii.gz":', error);
        update(state => ({ 
          ...state, 
          isLoading: false,
          currentFile: null,
          errorMessage: error instanceof Error 
            ? `Failed to load default: ${error.message}. Check console.`
            : 'An unexpected error occurred loading default. Check console.'
        }));
      }
    },

    // Load a file from user upload
    loadFromFile: async (file: File) => {
      const nv = getInstance();
      if (!nv) {
        update(state => ({ 
          ...state, 
          errorMessage: "NiiVue viewer is not ready. Please wait or refresh." 
        }));
        return;
      }

      update(state => ({ 
        ...state, 
        isLoading: true, 
        errorMessage: '',
        currentFile: file.name
      }));

      try {
        await nv.loadFromFile(file);
        
        // Apply settings after load
        const state = get({ subscribe });
        if (state.instance) {
          // Update slice type
          try {
            const multiplanarType = typeof (state.instance as any).sliceTypeMultiplanar === 'number'
                                ? (state.instance as any).sliceTypeMultiplanar
                                : 3;
            
            if (state.sliceType === 3) {
              state.instance.setSliceType(multiplanarType);
            } else {
              state.instance.setSliceType(state.sliceType);
            }
          } catch (e) {
            console.error("Error setting slice type:", e);
            update(s => ({ ...s, errorMessage: "Failed to change view type." }));
          }

          // Apply colormap
          try {
            if (state.instance.volumes && state.instance.volumes.length > 0) {
              state.instance.volumes[0].colormap = state.selectedColormap;
              state.instance.updateGLVolume();
            }
          } catch (e) {
            console.error("Error applying colormap:", e);
            update(s => ({ ...s, errorMessage: "Failed to apply colormap." }));
          }
        }

        update(state => ({ ...state, isLoading: false }));
      } catch (error) {
        console.error(`Error loading file "${file.name}":`, error);
        update(state => ({ 
          ...state, 
          isLoading: false,
          currentFile: null,
          errorMessage: error instanceof Error 
            ? `Failed to load: ${error.message}. Check console.`
            : 'An unexpected error occurred. Check console.'
        }));
      }
    },

    // Update slice type
    setSliceType: (newType: number) => {
      update(state => {
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
      update(state => {
        if (!state.instance || !state.instance.volumes || state.instance.volumes.length === 0) {
          return { ...state, selectedColormap: colormap };
        }

        try {
          state.instance.volumes[0].colormap = colormap;
          state.instance.updateGLVolume();
          return { ...state, selectedColormap: colormap, errorMessage: '' };
        } catch (e) {
          console.error("Error applying colormap:", e);
          return { ...state, errorMessage: "Failed to apply colormap." };
        }
      });
    },

    // Reset view to defaults
    resetView: () => {
      update(state => {
        if (!state.instance) return state;

        try {
          state.instance.setDefaults();
          
          // Reset colormap if volume is loaded
          if (state.instance.volumes?.length > 0) {
            state.instance.volumes[0].colormap = 'inferno';
            state.instance.updateGLVolume();
          }
          
          // Reset slice type
          const multiplanarType = typeof (state.instance as any).sliceTypeMultiplanar === 'number'
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
          console.error("Error calling nv.setDefaults():", e);
          return { ...state, errorMessage: "Failed to reset view." };
        }
      });
    },

    // Reset error state
    clearError: () => {
      update(state => ({ ...state, errorMessage: '' }));
    }
  };
};

// Export a singleton instance of the store
export const niivueStore = createNiivueStore();

// Export available colormaps as a constant
export const AVAILABLE_COLORMAPS = [
  'grayscale', 'negative', 'viridis', 'plasma', 'magma', 'inferno',
  'hot', 'cool', 'bone', 'pink', 'jet', 'hsv',
  'spring', 'summer', 'autumn', 'winter', 'surface'
]; 