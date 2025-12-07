\# SketchUp Geometry System — How SketchUp Actually Works

SketchUp’s modeling engine is deceptively simple but incredibly powerful.    
Unlike typical 3D engines, SketchUp is NOT built on triangulated meshes or boolean operations.    
Instead, it uses \*\*edges, faces, and topology relationships\*\* to create clean, editable geometry.

This document explains:

\- How geometry is represented    
\- How faces are formed    
\- How openings are created    
\- How extrusion works    
\- Why SketchUp avoids booleans    
\- How drawing on faces splits them    
\- How the inference system works  

\---

\# 1\. Core Geometry Model

SketchUp uses only a few fundamental entity types:

\#\#\# \*\*1.1 Vertex\*\*  
A point in 3D space:  
\- Has a position    
\- Connected to edges    
\- Automatically merges with nearby points  

\#\#\# \*\*1.2 Edge\*\*  
A straight line segment between two vertices:  
\- Defines face boundaries    
\- Never curves (curves are segmented edges)    
\- Carries no thickness  

\#\#\# \*\*1.3 Face\*\*  
A \*\*planar polygon\*\* bordered by edges:  
\- Must lie on a plane    
\- Can have an outer loop and inner loops (holes)    
\- Not triangulated internally  

SketchUp represents a face like:

Face

* OuterLoop: \[edge1, edge2, edge3, ...\]

* InnerLoops: \[  
   \[edgeA, edgeB, edgeC\], // hole  
   ...  
   \]

\#\#\# \*\*1.4 Groups & Components\*\*  
These isolate geometry:  
\- Edges/faces inside do not merge with the outside    
\- Used to keep walls, windows, furniture separate    
\- Components allow instancing  

\#\#\# \*\*1.5 Materials\*\*  
Textures/colors applied directly to faces.

\---

\# 2\. How Faces Are Created

SketchUp automatically forms a face when:

1\. A closed loop of edges exists    
2\. All edges are coplanar  

Once a loop is closed, SketchUp detects planarity and fills it with a face.

\#\#\# Important:  
\- Faces only exist if edges form a planar boundary    
\- Non-planar edge loops will NOT form a face    
\- Faces are never non-planar  

\---

\# 3\. No Triangulation (Internal)

SketchUp faces do \*\*not\*\* store triangles.

\- A single face may have unlimited sides    
\- Triangles are only created when exporting to formats like OBJ/GLTF    
\- This keeps geometry clean and editable    
\- UVs stay simple because each face is a single polygon  

\---

\# 4\. Implicit Parametric Behavior

SketchUp is NOT parametric like Revit or Fusion 360\.

But it appears parametric because:

\- Edges maintain connections    
\- Faces rebuild automatically when edges move    
\- Adjacent faces update themselves    
\- Holes stay attached to faces during modifications  

There's \*\*no explicit constraint system\*\*.    
Everything is derived from connectivity.

\#\#\# Example:  
Move a vertex → connected edges adjust → connected faces update.

This “smart” behavior comes entirely from topology rules.

\---

\# 5\. Drawing on Faces (How SketchUp Splits Faces)

When a user draws a shape on an existing face:

1\. SketchUp adds new edges    
2\. The edges subdivide the face    
3\. SketchUp destroys the old face    
4\. SketchUp creates new faces defined by the new loops

\#\#\# Example: Drawing a rectangle on a wall face

You get:

\- Outer wall face    
\- A new inner face    
\- Clean edge loops  

This is \*\*not\*\* a boolean operation.    
Just precise face splitting.

\---

\# 6\. Extrusion: How Push/Pull Works

Push/Pull is essentially a \*\*translated copy of the face\*\*.

\#\#\# Steps:

1\. Select a planar face    
2\. Drag/extrude along the normal vector    
3\. SketchUp:  
   \- Creates a new face offset from the original    
   \- Connects all boundary edges with new side faces  

The result is a \*\*closed prismatic volume\*\*.

\#\#\# Push/Pull can:  
\- Create solids    
\- Offset faces    
\- Cut openings through walls  

\---

\# 7\. Creating Openings (SketchUp Method)

SketchUp \*\*does not use booleans\*\* to cut openings.

It uses \*\*face splitting \+ face deletion\*\*.

\#\# Workflow:

\#\#\# \*\*1. User draws a rectangle on a wall face\*\*  
SketchUp:  
\- Splits the wall face    
\- Creates an inner face for the opening boundary

\#\#\# \*\*2. User Push/Pulls the inner face through the wall\*\*  
SketchUp extrudes that face.

\#\#\# \*\*3. Push/Pull intersects the opposite face\*\*  
SketchUp detects a “through cut”.

\#\#\# \*\*4. SketchUp deletes both the front and back faces\*\*  
The opening is now cleanly cut.

\#\#\# \*\*5. SketchUp creates surrounding faces\*\*  
It generates perfect quads around the hole.

\*\*No triangulation, no boolean, no mesh corruption.\*\*

This is why SketchUp models stay clean even after repeated edits.

\---

\# 8\. Why SketchUp Avoids Boolean Operations

Boolean operations create:

\- High face counts    
\- Triangulation    
\- Non-manifold edges    
\- Holes    
\- Shading artifacts    
\- Unpredictable vertex cleanup  

SketchUp is built for \*clean architectural modeling\*, so it avoids booleans entirely in normal drawing/editing.

Booleans exist but are optional for advanced users.

\---

\# 9\. Opening Logic (SketchUp Algorithm Simplified)

\`\`\`text  
If (push/pull face intersects a coplanar face on the opposite side):  
    \- Delete the front face of the opening  
    \- Delete the back face of the opening  
    \- Create edge loops around the opening perimeter  
    \- Generate side faces for thickness

# **10\. SketchUp Inference System**

SketchUp constantly analyzes the scene to provide inference snaps:

* Endpoint

* Midpoint

* Center

* On Edge

* On Face

* Perpendicular

* Parallel

* Tangent

* From Point

* Intersection

These visual cues are what make SketchUp feel “smart” and intuitive.

# **11\. Surface Healing & Merging**

SketchUp has strong auto-merging rules:

* Touching edges fuse

* Touching faces merge

* Duplicate edges are removed

* Coplanar adjacent faces auto-merge

This keeps the model clean without user intervention.

---

**12\. Summary**

SketchUp’s geometry engine is based on:

* Simple edges and faces

* Planarity detection

* Automatic face splitting

* Topology-based updates

* Push/Pull extrusion

* Smart deletion for openings

* Zero triangulation

* No boolean dependency

* Strong inference system

* Clean topology-preserving behavior

This combination allows SketchUp to stay fast, clean, and intuitive, even with very large models.

**13\. How to Replicate This in Your Web App**

If you're building a SketchUp-like tool using Three.js:

You should:

* Store geometry as **2D polygons \+ height**

* Rebuild meshes from data (don’t modify meshes directly)

* Use polygon clipping for openings

* Extrude shapes afterward

* Never use CSG for architecture

* Implement a face-splitting system like SketchUp

* Use an inference engine for snapping

