// BST Node Class
class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.id = Math.random().toString(36).substr(2, 9); // Unique ID for D3
    }
}

// BST Class
class BinarySearchTree {
    constructor() {
        this.root = null;
        this.size = 0;
    }

    insert(value) {
        const newNode = new BSTNode(value);
        
        if (!this.root) {
            this.root = newNode;
            this.size++;
            return newNode;
        }

        let current = this.root;
        while (current) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    newNode.parent = current;
                    this.size++;
                    return newNode;
                }
                current = current.left;
            } else if (value > current.value) {
                if (!current.right) {
                    current.right = newNode;
                    newNode.parent = current;
                    this.size++;
                    return newNode;
                }
                current = current.right;
            } else {
                // Value already exists
                return null;
            }
        }
    }

    delete(value) {
        const node = this._findNode(value);
        if (!node) return null;

        const deletedId = node.id;

        if (!node.left && !node.right) {
            this._replaceNode(node, null);
        } else if (!node.left) {
            this._replaceNode(node, node.right);
        } else if (!node.right) {
            this._replaceNode(node, node.left);
        } else {
            const successor = this._findMin(node.right);
            node.value = successor.value; // keep node id for stable visualization
            this._replaceNode(successor, successor.right);
        }
        this.size--;
        return deletedId;
    }

    clear() {
        this.root = null;
        this.size = 0;
    }

    search(value) {
        const path = [];
        let current = this.root;
        
        while (current) {
            path.push(current);
            if (value === current.value) {
                return { found: true, path };
            }
            current = value < current.value ? current.left : current.right;
        }
        
        return { found: false, path };
    }

    inorder() {
        const result = [];
        this.inorderHelper(this.root, result);
        return result;
    }

    inorderHelper(node, result) {
        if (node) {
            this.inorderHelper(node.left, result);
            result.push(node);
            this.inorderHelper(node.right, result);
        }
    }

    preorder() {
        const result = [];
        this.preorderHelper(this.root, result);
        return result;
    }

    preorderHelper(node, result) {
        if (node) {
            result.push(node);
            this.preorderHelper(node.left, result);
            this.preorderHelper(node.right, result);
        }
    }

    postorder() {
        const result = [];
        this.postorderHelper(this.root, result);
        return result;
    }

    postorderHelper(node, result) {
        if (node) {
            this.postorderHelper(node.left, result);
            this.postorderHelper(node.right, result);
            result.push(node);
        }
    }

    // Convert BST to D3 hierarchical format
    toD3Format() {
        if (!this.root) return null;
        
        const convert = (node) => {
            if (!node) return null;
            
            const d3Node = {
                id: node.id,
                name: node.value.toString(),
                value: node.value,
                children: []
            };
            
            if (node.left) {
                d3Node.children.push(convert(node.left));
            }
            if (node.right) {
                d3Node.children.push(convert(node.right));
            }
            
            return d3Node;
        };
        
        return convert(this.root);
    }

    _findNode(value) {
        let cur = this.root;
        while (cur) {
            if (value === cur.value) return cur;
            cur = value < cur.value ? cur.left : cur.right;
        }
        return null;
    }

    _findMin(node) {
        while (node && node.left) node = node.left;
        return node;
    }

    _replaceNode(oldNode, newNode) {
        if (!oldNode.parent) {
            this.root = newNode;
        } else if (oldNode === oldNode.parent.left) {
            oldNode.parent.left = newNode;
        } else {
            oldNode.parent.right = newNode;
        }
        if (newNode) newNode.parent = oldNode.parent;
    }
}

// Visualization Class
class BSTVisualizer {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.bst = new BinarySearchTree();
        this.animationSpeed = 1000; // milliseconds
        this.currentAnimationToken = 0;
        this._pendingTimeout = null;
        
        this.setupSVG();
        this.setupEventListeners();
        this.buildPreDefinedTree();
    }

    buildPreDefinedTree() {
        // Pre-defined values for the tree
        const values = [50, 25, 75, 15, 35, 65, 85, 10, 20, 30, 40, 60, 70, 80, 90];
        
        // Insert all values into the tree
        values.forEach(value => {
            this.bst.insert(value);
        });
        
        // Draw the initial tree
        this.drawTree();
    }

    setupSVG() {
        const containerRect = this.container.node().getBoundingClientRect();
        this.width = containerRect.width || 800;
        this.height = 500;
        
        this.svg = this.container
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('background-color', '#f9fafb');
        
        this.g = this.svg.append('g');
        
        // Zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        
        this.svg.call(this.zoom);
    }

    setupEventListeners() {
        // Edit buttons
        const insertBtn = document.getElementById('insertBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        const clearBtn = document.getElementById('clearBtn');
        const valueInput = document.getElementById('valueInput');

        if (insertBtn) insertBtn.addEventListener('click', () => {
            const value = parseInt(valueInput.value);
            if (Number.isNaN(value)) return alert('Enter a valid number');
            const node = this.bst.insert(value);
            if (!node) return alert('Value already exists');
            valueInput.value = '';
            this.drawTree();
            this._flashById(node.id, 'highlighted');
        });

        if (deleteBtn) deleteBtn.addEventListener('click', () => {
            const value = parseInt(valueInput.value);
            if (Number.isNaN(value)) return alert('Enter a valid number');
            const deletedId = this.bst.delete(value);
            if (!deletedId) return alert('Value not found');
            valueInput.value = '';
            this.drawTree();
        });

        if (clearBtn) clearBtn.addEventListener('click', () => {
            this.bst.clear();
            this.drawTree();
            const info = document.getElementById('searchInfo');
            if (info) info.style.display = 'none';
            const out = document.getElementById('traversalOutput');
            if (out) out.value = '';
        });

        // Traversal buttons
        document.getElementById('inorderBtn').addEventListener('click', () => this.handleTraversal('inorder'));
        document.getElementById('preorderBtn').addEventListener('click', () => this.handleTraversal('preorder'));
        document.getElementById('postorderBtn').addEventListener('click', () => this.handleTraversal('postorder'));
    }

    handleNodeClick(nodeData) {
        const targetValue = nodeData.value;
        const result = this.bst.search(targetValue);
        
        // Show search info
        const searchInfo = document.getElementById('searchInfo');
        const searchPathText = document.getElementById('searchPathText');
        
        if (result.found) {
            const pathValues = result.path.map(node => node.value);
            const pathString = pathValues.join(' → ');
            searchPathText.textContent = `Searching for ${targetValue}: ${pathString} (${result.path.length} steps)`;
            searchInfo.style.display = 'block';
            
            // Animate the search path
            this.animateSearchPath(result.path, true);
        }
    }

    handleTraversal(type) {
        let nodes;
        switch (type) {
            case 'inorder':
                nodes = this.bst.inorder();
                break;
            case 'preorder':
                nodes = this.bst.preorder();
                break;
            case 'postorder':
                nodes = this.bst.postorder();
                break;
        }
        
        // Update traversal output
        const output = nodes.map(node => node.value).join(' → ');
        document.getElementById('traversalOutput').value = `${type.toUpperCase()}: ${output}`;
        
        // Animate traversal
        const token = ++this.currentAnimationToken;
        this.animateTraversal(nodes, token);
    }

    animateTraversal(nodes, token) {
        // Ensure clean start
        this.g.selectAll('.node').classed('traversal', false);
        this.g.selectAll('.edge')
            .classed('traversal', false)
            .attr('stroke-dasharray', null)
            .attr('stroke-dashoffset', null);

        // Map node id to parent id using current D3 hierarchy in the scene
        const idToParentId = new Map();
        this.g.selectAll('.node').each((d) => {
            if (d && d.parent && d.data && d.parent.data) {
                idToParentId.set(d.data.id, d.parent.data.id);
            }
        });

        let index = 0;
        const animateNext = () => {
            if (token !== this.currentAnimationToken) return;
            if (index < nodes.length) {
                const current = nodes[index];

                // Clear previous step highlight so only one node/edge is active
                this.g.selectAll('.node').classed('traversal', false);
                this.g.selectAll('.edge')
                    .classed('traversal', false)
                    .attr('stroke-dasharray', null)
                    .attr('stroke-dashoffset', null);

                // Highlight current node
                this.g.selectAll('.node')
                    .filter(d => d && d.data && d.data.id === current.id)
                    .classed('traversal', true);

                // Animate incoming edge for the current node if it has a parent
                const parentId = idToParentId.get(current.id);
                if (parentId) {
                    const edgeSel = this.g.selectAll('.edge')
                        .filter(l => l && l.target && l.target.data && l.target.data.id === current.id)
                        .classed('traversal', true)
                        .attr('stroke-dasharray', function() {
                            const len = this.getTotalLength();
                            return `${len} ${len}`;
                        })
                        .attr('stroke-dashoffset', function() {
                            return this.getTotalLength();
                        })
                        .transition()
                        .duration(this.animationSpeed)
                        .attr('stroke-dashoffset', 0);

                    // Chain next step to the end of the edge transition
                    edgeSel.on('end', () => {
                        if (token !== this.currentAnimationToken) return;
                        index++;
                        animateNext();
                    });
                } else {
                    // Root has no incoming edge; advance after a delay
                    index++;
                    setTimeout(animateNext, this.animationSpeed);
                }
            } else {
                // Clear at the end
                this.g.selectAll('.node').classed('traversal', false);
                this.g.selectAll('.edge')
                    .classed('traversal', false)
                    .attr('stroke-dasharray', null)
                    .attr('stroke-dashoffset', null);
            }
        };

        animateNext();
    }

    animateSearchPath(path, found) {
        const token = ++this.currentAnimationToken;
        if (path.length === 0) return;

        // Clear prior search styling
        this.g.selectAll('.node').classed('search-path', false);
        this.g.selectAll('.edge').classed('search-path', false)
            .attr('stroke-dasharray', null)
            .attr('stroke-dashoffset', null);

        // Build quick lookup for edge animation by target id
        let index = 0;
        const step = () => {
            if (token !== this.currentAnimationToken) return;
            if (index < path.length) {
                const current = path[index];
                // Highlight node
                this.g.selectAll('.node')
                    .filter(d => d && d.data && d.data.id === current.id)
                    .classed('search-path', true);

                // Animate incoming edge if not the root
                if (index > 0) {
                    const prev = path[index - 1];
                    this.g.selectAll('.edge')
                        .filter(l => l && l.target && l.target.data && l.target.data.id === current.id)
                        .classed('search-path', true)
                        .attr('stroke-dasharray', function() {
                            const len = this.getTotalLength();
                            return `${len} ${len}`;
                        })
                        .attr('stroke-dashoffset', function() {
                            return this.getTotalLength();
                        })
                        .transition()
                        .duration(this.animationSpeed / 1.2)
                        .attr('stroke-dashoffset', 0);
                }

                index++;
                setTimeout(step, this.animationSpeed / 1.1);
            } else {
                setTimeout(() => {
                    this.g.selectAll('.node').classed('search-path', false);
                    this.g.selectAll('.edge').classed('search-path', false)
                        .attr('stroke-dasharray', null)
                        .attr('stroke-dashoffset', null);
                }, 900);
            }
        };

        step();
    }

    highlightNode(nodeId, type) {
        // Clear previous highlights
        this.g.selectAll('.node').classed('highlighted search-path traversal', false);
        this.g.selectAll('.edge').classed('highlighted search-path traversal', false);
        
        // Add new highlight
        this.g.selectAll('.node')
            .filter(d => d.id === nodeId)
            .classed(type, true);
        
        // Highlight connecting edge if it exists
        this.g.selectAll('.edge')
            .filter(d => d.target.id === nodeId)
            .classed(type, true);
    }

    _flashById(nodeId, cls) {
        this.g.selectAll('.node').classed(cls, false);
        this.g.selectAll('.node').filter(d => d.id === nodeId).classed(cls, true);
        setTimeout(() => {
            this.g.selectAll('.node').classed(cls, false);
        }, 800);
    }

    drawTree() {
        const treeData = this.bst.toD3Format();
        
        // Clear existing tree
        this.g.selectAll('*').remove();
        
        if (!treeData) {
            // Empty tree message
            this.g.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.height / 2)
                .attr('text-anchor', 'middle')
                .attr('font-size', '18px')
                .attr('fill', '#6b7280')
                .text('Tree is empty');
            return;
        }
        
        // Create tree layout
        const tree = d3.tree().size([this.width - 100, this.height - 100]);
        const root = d3.hierarchy(treeData);
        tree(root);
        
        // Draw edges
        const links = this.g.selectAll('.edge')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'edge')
            .attr('d', d3.linkVertical()
                .x(d => d.x + 50)
                .y(d => d.y + 50))
            .style('fill', 'none')
            .style('stroke', '#374151')
            .style('stroke-width', 2);
        
        // Draw nodes
        const nodes = this.g.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x + 50}, ${d.y + 50})`)
            .on('click', (event, d) => {
                this.handleNodeClick(d.data);
            });
        
        // Add circles
        nodes.append('circle')
            .attr('r', 20)
            .style('fill', '#3b82f6')
            .style('stroke', '#1e40af')
            .style('stroke-width', 2);
        
        // Add text
        nodes.append('text')
            .attr('class', 'node-text')
            .text(d => d.data.name)
            .style('font-size', '14px')
            .style('font-weight', 'bold');
        
        // Center the tree
        const bounds = this.g.node().getBBox();
        const xOffset = (this.width - bounds.width) / 2 - bounds.x;
        const yOffset = (this.height - bounds.height) / 2 - bounds.y;
        
        this.g.attr('transform', `translate(${xOffset}, ${yOffset})`);
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BSTVisualizer('treeContainer');
});
