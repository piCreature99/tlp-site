import { motion } from 'framer-motion';
// This is your "Vector Shape" - customize the SVG path for your specific look
export default function SideVector({ side, bgColor }: { side: 'left' | 'right', bgColor: string }){
    return (
        <motion.svg
            layoutId={`vector-${side}`}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
            }}
            style={{
                position: 'absolute',
                [side]: '-30px',
                top: '50%',
                y: '-50%',
                zIndex: 1,
                pointerEvents: 'none',
                overflow: 'visible'
            }}
            width="30"
            height="50"
            viewBox="0 0 30 50"
        >
            <path
                d={side === 'left'
                    // LEFT SIDE: Start bottom-right (30,50), fast rise to top-left (0,0)
                    // C 30 25 (shoots up), 15 0 (pulls left), 0 0 (ends flat at top)
                    // ? "M30 50 C 30 25, 15 0, 0 0 L 30 0 Z"
                    ? "M30 0 C 30 25, 15 50, 0 50 L 30 50 Z" // flip y
                    // M means move to a starting point
                    // M30 50 means x = 30, y = 50,
                    // C = cubic bezier curve, create smooth curve using 2 control points
                    // Requires 3 pairs of numbers: ControlPoint1, ControlPoint2, and EndPoint
                    // L Line to, Draws a perfectly straight line from the current position to the new coordinates
                    // L 30 0 means: "Draw a straight line back to the very first point M to seal the shape so it can be filled"

                    // RIGHT SIDE: Start bottom-left (0,50), fast rise to top-right (30,0)
                    // C 0 25 (shoots up), 15 0 (pulls right), 30 0 (ends flat at top)
                    // : "M0 50 C 0 25, 15 0, 30 0 L 0 0 Z"
                    : "M0 0 C 0 25, 15 50, 30 50 L 0 50 Z" // flip y
                }
                fill={bgColor}
            />
            </motion.svg>
    );
}