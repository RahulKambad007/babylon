window.addEventListener('load', function () {
    // Babylon.js setup
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    // Create a basic camera (fixed for AR)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    // Light for the scene
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Load the custom .glb model
    BABYLON.SceneLoader.ImportMesh("", "assets/", "custom-model.glb", scene, function (meshes) {
        var glbModel = meshes[0];
        glbModel.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);  // Adjust the scale as needed
        glbModel.position.y = 0;  // Adjust position if needed
        glbModel.visibility = false;  // Hide initially

        // Link the model to the AR.js marker
        const marker = document.querySelector('a-marker');

        // Show the model when the marker is detected
        marker.addEventListener('markerFound', () => {
            glbModel.visibility = true;
        });

        // Hide the model when the marker is lost
        marker.addEventListener('markerLost', () => {
            glbModel.visibility = false;
        });

        // Sync Babylon.js model position and rotation with marker
        marker.addEventListener('transformChanged', () => {
            let markerPosition = marker.object3D.position;
            let markerRotation = marker.object3D.rotation;

            // Update the GLB model's position and rotation based on marker
            glbModel.position.x = markerPosition.x;
            glbModel.position.y = markerPosition.y;
            glbModel.position.z = markerPosition.z;

            glbModel.rotation.x = markerRotation.x;
            glbModel.rotation.y = markerRotation.y;
            glbModel.rotation.z = markerRotation.z;
        });
    });

    // Render loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Handle window resizing
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
