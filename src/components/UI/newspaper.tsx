import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ThemeContext } from '../../context/theme';

const Newspaper3D: React.FC = () => {
    const { theme } = useContext(ThemeContext);
    const mountRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const bookRef = useRef<THREE.Group | null>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        // Set up the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(theme === 'dark' ? 0x111010 : 0xffffff);
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create the book shape
        const bookGroup = new THREE.Group();

        // Left page
        const leftGeometry = new THREE.PlaneGeometry(7, 10);
        const leftMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const leftPage = new THREE.Mesh(leftGeometry, leftMaterial);
        leftPage.position.x = -2.05; // Adjust position to the left
        leftPage.rotation.y = Math.PI * 0.05; // Slightly rotate to simulate an open book

        // Right page
        const rightGeometry = new THREE.PlaneGeometry(7, 10);
        const rightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const rightPage = new THREE.Mesh(rightGeometry, rightMaterial);
        rightPage.position.x = 4.6; // Adjust position to the right
        rightPage.rotation.y = -Math.PI * 0.05; // Slightly rotate to simulate an open book

        // Add pages to the book group
        bookGroup.add(leftPage);
        bookGroup.add(rightPage);
        scene.add(bookGroup);
        bookRef.current = bookGroup;

        // Add texturing to simulate a book's pages
        const loader = new THREE.TextureLoader();
        loader.load('/newspaper image/Tribune.webp', (texture) => {
            leftMaterial.map = texture;
            leftMaterial.needsUpdate = true;
        });

        loader.load('/newspaper image/BombayTimes.webp', (texture) => {
            rightMaterial.map = texture;
            rightMaterial.needsUpdate = true;
        });

        // Position the camera
        camera.position.z = 10;

        // Variables for mouse movement
        let mouseX = 0;
        let mouseY = 0;

        // Event listener for mouse move
        const onMouseMove = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Cancel any ongoing animation
            if (animationRef.current) {
                animationRef.current.kill();
            }

            // Use gsap to smoothly rotate the book towards the mouse position
            animationRef.current = gsap.to(bookGroup.rotation, {
                x: mouseY * 1.5,
                y: mouseX * 1.5,
                duration: 0.5,
                ease: 'power3.out',
            });
        };

        // Event listener for mouse leave
        const onMouseLeave = () => {
            if (bookRef.current) {
                animationRef.current = gsap.to(bookRef.current.rotation, {
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                });
            }
        };

        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('mouseleave', onMouseLeave);

        // Animation function
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        // Adjust the canvas size to the container size
        const handleResize = () => {
            const width = mountRef.current?.clientWidth || window.innerWidth;
            const height = mountRef.current?.clientHeight || window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
            renderer.domElement.removeEventListener('mouseleave', onMouseLeave);
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, [theme]);

    // Update the renderer's background color when theme changes
    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setClearColor(theme === 'dark' ? 0x111010 : 0xffffff);
        }
    }, [theme]);

    return <div ref={mountRef} style={{ width: '50%', height: '500px', position: 'absolute', right: '5%', top:'10%' }} />;
};

export default Newspaper3D;
