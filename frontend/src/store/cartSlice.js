import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        // Maps productId -> { name, hex } for selected color per cart item
        colorSelections: {},
    },
    reducers: {
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        setColorSelection: (state, action) => {
            const { productId, color } = action.payload;
            state.colorSelections[productId] = color;
        },
        clearColorSelections: (state) => {
            state.colorSelections = {};
        },
    },
});

export const { removeFromCart, setColorSelection, clearColorSelections } = cartSlice.actions;
export default cartSlice.reducer;
