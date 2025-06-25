import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/DocsPage.css";

const DocsPage = () => {
  return (
    <div className="docs-container">
      <header className="docs-header">
        <div className="header-content">
          <h1>Graph Algorithm Documentation</h1>
          <div className="nav-links">
            <Link to="/" className="header-link">Home</Link>
            <Link to="/graph" className="header-link">Graph Canvas</Link>
            <Link to="/" className="back-to-app-btn">Back to App</Link>
          </div>
        </div>
      </header>
      
      <div className="docs-content">
        <nav className="docs-sidebar">
          <ul>
            <li><a href="#bfs">Breadth-First Search (BFS)</a></li>
            <li><a href="#dfs">Depth-First Search (DFS)</a></li>
            <li><a href="#khan">Khan's Algorithm</a></li>
          </ul>
        </nav>
        
        <main className="docs-main">
          <section id="bfs" className="algorithm-section">
            <h2>Breadth-First Search (BFS)</h2>
            
            <div className="algorithm-description">
              <p>Breadth-First Search is a graph traversal algorithm that explores all vertices at the present depth before moving on to vertices at the next depth level.</p>
              
              <h3>How It Works</h3>
              <ol>
                <li>Start from a chosen node (source)</li>
                <li>Visit all its neighbors before visiting any of their neighbors</li>
                <li>Use a queue data structure to keep track of nodes to visit next</li>
                <li>Mark nodes as visited to avoid processing them multiple times</li>
              </ol>
              
              <h3>Applications</h3>
              <ul>
                <li><strong>Shortest Path in Unweighted Graphs</strong>: BFS guarantees the shortest path in terms of the number of edges</li>
                <li><strong>Connected Components</strong>: Finding all connected components in an undirected graph</li>
                <li><strong>Web Crawling</strong>: Traversing web pages through hyperlinks</li>
                <li><strong>Social Network Analysis</strong>: Finding people within a certain degree of connection</li>
              </ul>
              
              <h3>Example</h3>
              <div className="algorithm-example">
                <div className="example-description">
                  <p>Consider this undirected graph with nodes 1-6:</p>
                  <pre>
                    1 --- 2 --- 5
                    |     |
                    3 --- 4 --- 6
                  </pre>
                  
                  <p>BFS traversal starting from node 1:</p>
                  <ol>
                    <li>Start at node 1, mark as visited, add to queue</li>
                    <li>Explore neighbors of 1: nodes 2 and 3. Mark them visited and add to queue.</li>
                    <li>Next, explore neighbors of 2: only node 5 is unvisited. Mark it and add to queue.</li>
                    <li>Then explore neighbors of 3: only node 4 is unvisited. Mark it and add to queue.</li>
                    <li>Continue with neighbors of 5: none are unvisited.</li>
                    <li>Finally, explore neighbors of 4: only node 6 is unvisited.</li>
                  </ol>
                  
                  <p>The final traversal order: 1, 2, 3, 5, 4, 6</p>
                </div>
                
                <div className="code-block">
                  <h4>BFS Pseudocode</h4>
                  <pre>
{`BFS(graph, startNode):
    create empty queue Q
    mark startNode as visited
    enqueue startNode into Q
    
    while Q is not empty:
        node = dequeue from Q
        process node
        
        for each neighbor of node:
            if neighbor is not visited:
                mark neighbor as visited
                enqueue neighbor into Q`}
                  </pre>
                </div>
              </div>
              
              <div className="time-complexity">
                <h3>Time Complexity</h3>
                <p>O(V + E) where V is the number of vertices and E is the number of edges in the graph.</p>
                <p>This is because each vertex and each edge will be explored at most once.</p>
              </div>
            </div>
          </section>
          
          <section id="dfs" className="algorithm-section">
            <h2>Depth-First Search (DFS)</h2>
            
            <div className="algorithm-description">
              <p>Depth-First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking.</p>
              
              <h3>How It Works</h3>
              <ol>
                <li>Start from a chosen node (source)</li>
                <li>Explore one path as deeply as possible before backtracking</li>
                <li>Use a stack data structure (often implemented recursively) to keep track of nodes</li>
                <li>Mark nodes as visited to avoid cycles</li>
              </ol>
              
              <h3>Applications</h3>
              <ul>
                <li><strong>Cycle Detection</strong>: Finding cycles in a graph</li>
                <li><strong>Topological Sorting</strong>: Arranging directed acyclic graph (DAG) vertices in a linear order</li>
                <li><strong>Connected Components</strong>: Finding all connected components in an undirected graph</li>
                <li><strong>Maze Solving</strong>: Finding a path through a maze</li>
              </ul>
              
              <h3>Example</h3>
              <div className="algorithm-example">
                <div className="example-description">
                  <p>Consider this undirected graph with nodes 1-6:</p>
                  <pre>
                    1 --- 2 --- 5
                    |     |
                    3 --- 4 --- 6
                  </pre>
                  
                  <p>DFS traversal starting from node 1:</p>
                  <ol>
                    <li>Start at node 1, mark as visited</li>
                    <li>Choose neighbor 2, mark as visited</li>
                    <li>Choose neighbor 5, mark as visited</li>
                    <li>No unvisited neighbors for 5, backtrack to 2</li>
                    <li>Choose neighbor 4, mark as visited</li>
                    <li>Choose neighbor 6, mark as visited</li>
                    <li>No unvisited neighbors for 6, backtrack to 4</li>
                    <li>No unvisited neighbors for 4, backtrack to 2</li>
                    <li>No unvisited neighbors for 2, backtrack to 1</li>
                    <li>Choose neighbor 3, mark as visited</li>
                    <li>No unvisited neighbors for 3, done</li>
                  </ol>
                  
                  <p>The final traversal order: 1, 2, 5, 4, 6, 3</p>
                </div>
                
                <div className="code-block">
                  <h4>DFS Pseudocode (Recursive)</h4>
                  <pre>
{`DFS(graph, node):
    mark node as visited
    process node
    
    for each neighbor of node:
        if neighbor is not visited:
            DFS(graph, neighbor)

// Initial call
DFS(graph, startNode)`}
                  </pre>
                </div>
              </div>
              
              <div className="time-complexity">
                <h3>Time Complexity</h3>
                <p>O(V + E) where V is the number of vertices and E is the number of edges in the graph.</p>
                <p>This is because each vertex and each edge will be explored at most once.</p>
              </div>
            </div>
          </section>
          
          <section id="khan" className="algorithm-section">
            <h2>Khan's Algorithm for Topological Sorting</h2>
            
            <div className="algorithm-description">
              <p>Khan's algorithm is used to perform a topological sort on a directed acyclic graph (DAG), producing a linear ordering of vertices such that for every directed edge u → v, vertex u comes before v in the ordering.</p>
              
              <h3>How It Works</h3>
              <ol>
                <li>Calculate in-degree (number of incoming edges) for each vertex</li>
                <li>Enqueue all vertices with in-degree of 0</li>
                <li>While the queue is not empty:
                  <ul>
                    <li>Dequeue a vertex and add it to the result list</li>
                    <li>For each neighbor of the vertex, reduce its in-degree by 1</li>
                    <li>If a neighbor's in-degree becomes 0, enqueue it</li>
                  </ul>
                </li>
                <li>If all vertices are processed, return the ordering. If not, the graph has a cycle.</li>
              </ol>
              
              <h3>Applications</h3>
              <ul>
                <li><strong>Dependency Resolution</strong>: Task scheduling and package dependencies</li>
                <li><strong>Course Scheduling</strong>: Determining the order to take courses with prerequisites</li>
                <li><strong>Build Systems</strong>: Determining the order to compile files</li>
                <li><strong>Circuit Design</strong>: Ordering circuit components for evaluation</li>
              </ul>
              
              <h3>Example</h3>
              <div className="algorithm-example">
                <div className="example-description">
                  <p>Consider this directed graph representing course prerequisites:</p>
                  <pre>
                    CS101 → CS201 → CS301
                      ↓       ↓ 
                    MATH101 → CS202
                  </pre>
                  
                  <p>Khan's Algorithm steps:</p>
                  <ol>
                    <li>Calculate in-degrees: CS101 (0), MATH101 (1), CS201 (1), CS202 (2), CS301 (1)</li>
                    <li>Add vertices with in-degree 0 to queue: CS101</li>
                    <li>Process CS101: Remove from queue, add to result
                      <ul>
                        <li>Reduce in-degree of neighbors: CS201 (0), MATH101 (0)</li>
                        <li>Add CS201 and MATH101 to queue</li>
                      </ul>
                    </li>
                    <li>Process CS201: Remove from queue, add to result
                      <ul>
                        <li>Reduce in-degree of neighbors: CS301 (0), CS202 (1)</li>
                        <li>Add CS301 to queue</li>
                      </ul>
                    </li>
                    <li>Process MATH101: Remove from queue, add to result
                      <ul>
                        <li>Reduce in-degree of neighbors: CS202 (0)</li>
                        <li>Add CS202 to queue</li>
                      </ul>
                    </li>
                    <li>Process CS301: Remove from queue, add to result (no neighbors)</li>
                    <li>Process CS202: Remove from queue, add to result (no neighbors)</li>
                  </ol>
                  
                  <p>Topological Order: CS101, CS201, MATH101, CS301, CS202</p>
                </div>
                
                <div className="code-block">
                  <h4>Khan's Algorithm Pseudocode</h4>
                  <pre>
{`KahnTopologicalSort(graph):
    calculate in-degree for each vertex
    initialize empty result list
    initialize queue with all vertices that have in-degree 0
    
    while queue is not empty:
        vertex = dequeue from queue
        add vertex to result list
        
        for each neighbor of vertex:
            reduce in-degree of neighbor by 1
            if in-degree of neighbor becomes 0:
                enqueue neighbor
    
    if length of result list equals number of vertices:
        return result list (valid topological sort)
    else:
        return error (graph has a cycle)`}
                  </pre>
                </div>
              </div>
              
              <div className="time-complexity">
                <h3>Time Complexity</h3>
                <p>O(V + E) where V is the number of vertices and E is the number of edges.</p>
                <p>This is because we process each vertex and each edge exactly once.</p>
              </div>
              
              <div className="cycle-detection">
                <h3>Cycle Detection</h3>
                <p>Khan's algorithm also serves as a method to detect cycles in a directed graph. If the final topological order doesn't include all vertices from the graph, then the graph has at least one cycle.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
