# Binary Search Tree Visualizer

An interactive, single-page web application for visualizing Binary Search Tree operations with smooth animations, built using HTML, Tailwind CSS, JavaScript, and D3.js.

## Features

### Core Operations
- **Insert**: Add new nodes to the BST with visual feedback
- **Delete**: Remove nodes with smooth deletion animations
- **Search**: Find nodes with path highlighting
- **Clear**: Reset the entire tree

### Traversals
- **Inorder**: Left → Root → Right traversal
- **Preorder**: Root → Left → Right traversal  
- **Postorder**: Left → Right → Root traversal

### Interactive Controls
- **Play/Pause/Next Step**: Control traversal animations
- **Speed Control**: Adjust animation speed (Very Slow to Very Fast)
- **Zoom**: Pan and zoom the tree visualization

### Visual Features
- Smooth animations for all operations
- Color-coded highlights for different operations:
  - 🟡 Yellow: General highlights
  - 🟢 Green: Search path
  - 🟣 Purple: Traversal sequence
- Responsive design that works on desktop and mobile
- Real-time traversal output display

## How to Use

1. **Open the Application**: Simply open `index.html` in any modern web browser
2. **Insert Nodes**: Enter a number in the input field and click "Insert"
3. **Delete Nodes**: Enter a number and click "Delete" to remove it
4. **Search**: Enter a number and click "Search" to highlight the path
5. **Traversals**: Click any traversal button to see the order and start animation
6. **Control Animations**: Use Play/Pause/Next Step buttons to control traversal speed
7. **Clear Tree**: Click "Clear Tree" to start over

## Technical Implementation

### Architecture
- **BSTNode Class**: Represents individual tree nodes with unique IDs
- **BinarySearchTree Class**: Core BST logic with all operations
- **BSTVisualizer Class**: D3.js visualization and animation management

### Key Technologies
- **HTML5**: Semantic structure and accessibility
- **Tailwind CSS**: Modern, responsive styling
- **JavaScript ES6+**: Modern JavaScript with classes and modules
- **D3.js v7**: Data visualization and tree layout algorithms

### Animation System
- Smooth transitions for node insertion/deletion
- Step-by-step traversal highlighting
- Path animation for search operations
- Configurable animation speeds

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
dsa_project/
├── index.html          # Complete application (single file)
└── README.md          # This documentation
```

## Future Enhancements

The codebase is designed to be easily extensible. Potential additions:
- Additional tree types (AVL, Red-Black, etc.)
- More traversal algorithms (Level-order, etc.)
- Node value editing
- Tree statistics display
- Export/import functionality
- Undo/redo operations

## License

This project is open source and available under the MIT License.
