import React from 'react';

interface Tag {
  id: string;
  text: string;
  delay: number;
}

const FloatingTags: React.FC = () => {
  const tags: Tag[] = [
    { id: '1', text: 'React', delay: 0 },
    { id: '2', text: 'Python', delay: 1 },
    { id: '3', text: 'Node.js', delay: 2 },
    { id: '4', text: 'TypeScript', delay: 3 },
    { id: '5', text: 'Machine Learning', delay: 4 },
    { id: '6', text: 'Docker', delay: 5 },
    { id: '7', text: 'Kotlin', delay: 6 },
    { id: '8', text: 'Express', delay: 7 },
    { id: '9', text: 'Linux', delay: 8 },
    { id: '10', text: 'OpenCV', delay: 9 },
    { id: '11', text: 'MongoDB', delay: 10 },
    { id: '12', text: 'AWS', delay: 11 },
    { id: '13', text: 'GraphQL', delay: 12 },
    { id: '14', text: 'Redis', delay: 13 },
    { id: '15', text: 'Kubernetes', delay: 14 },
    { id: '16', text: 'Vue.js', delay: 15 },
    { id: '17', text: 'Angular', delay: 16 },
    { id: '18', text: 'PostgreSQL', delay: 17 },
    { id: '19', text: 'TensorFlow', delay: 18 },
    { id: '20', text: 'Flutter', delay: 19 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Hero text mask overlay - creates the glassy blur effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl h-64 bg-background/80 backdrop-blur-md rounded-2xl shadow-2xl border border-border/20"></div>
      </div>

      {/* First row - left to right, tightly packed */}
      <div className="absolute top-12 sm:top-16 left-0 w-full">
        {tags.slice(0, 8).map((tag, index) => (
          <div
            key={`row1-${tag.id}`}
            className="absolute animate-float-left"
            style={{
              left: `${(index * 12) - 5}%`,
              animationDelay: `${tag.delay}s`,
              animationDuration: '15s',
            }}
          >
            <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/15 backdrop-blur-sm border border-primary/25 rounded-full text-xs text-primary/70 font-medium whitespace-nowrap shadow-sm">
              {tag.text}
            </span>
          </div>
        ))}
      </div>

      {/* Second row - right to left, tightly packed */}
      <div className="absolute top-24 sm:top-32 left-0 w-full">
        {tags.slice(8, 16).map((tag, index) => (
          <div
            key={`row2-${tag.id}`}
            className="absolute animate-float-right"
            style={{
              right: `${(index * 11) - 3}%`,
              animationDelay: `${tag.delay}s`,
              animationDuration: '18s',
            }}
          >
            <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary/15 backdrop-blur-sm border border-secondary/25 rounded-full text-xs text-secondary/70 font-medium whitespace-nowrap shadow-sm">
              {tag.text}
            </span>
          </div>
        ))}
      </div>

      {/* Third row - left to right, tightly packed */}
      <div className="absolute top-36 sm:top-48 left-0 w-full">
        {tags.slice(16, 20).map((tag, index) => (
          <div
            key={`row3-${tag.id}`}
            className="absolute animate-float-left"
            style={{
              left: `${(index * 14) - 2}%`,
              animationDelay: `${tag.delay}s`,
              animationDuration: '20s',
            }}
          >
            <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-accent/15 backdrop-blur-sm border border-accent/25 rounded-full text-xs text-accent/70 font-medium whitespace-nowrap shadow-sm">
              {tag.text}
            </span>
          </div>
        ))}
      </div>

      {/* Additional tags for continuous flow - Row 1 */}
      <div className="absolute top-12 sm:top-16 left-0 w-full">
        {tags.slice(0, 8).map((tag, index) => (
          <div
            key={`row1-dup-${tag.id}`}
            className="absolute animate-float-left"
            style={{
              left: `${(index * 12) + 95}%`,
              animationDelay: `${tag.delay + 15}s`,
              animationDuration: '15s',
            }}
          >
            <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/15 backdrop-blur-sm border border-primary/25 rounded-full text-xs text-primary/70 font-medium whitespace-nowrap shadow-sm">
              {tag.text}
            </span>
          </div>
        ))}
      </div>

      {/* Additional tags for continuous flow - Row 2 */}
      <div className="absolute top-24 sm:top-32 left-0 w-full">
        {tags.slice(8, 16).map((tag, index) => (
          <div
            key={`row2-dup-${tag.id}`}
            className="absolute animate-float-right"
            style={{
              right: `${(index * 11) + 97}%`,
              animationDelay: `${tag.delay + 18}s`,
              animationDuration: '18s',
            }}
          >
            <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary/15 backdrop-blur-sm border border-secondary/25 rounded-full text-xs text-secondary/70 font-medium whitespace-nowrap shadow-sm">
              {tag.text}
            </span>
          </div>
        ))}
      </div>

      {/* Additional tags for continuous flow - Row 3 */}
      <div className="absolute top-36 sm:top-48 left-0 w-full">
        {tags.slice(16, 20).map((tag, index) => (
          <div
            key={`row3-dup-${tag.id}`}
            className="absolute animate-float-left"
            style={{
              left: `${(index * 14) + 98}%`,
              animationDelay: `${tag.delay + 20}s`,
              animationDuration: '20s',
            }}
          >
            <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-accent/15 backdrop-blur-sm border border-accent/25 rounded-full text-xs text-accent/70 font-medium whitespace-nowrap shadow-sm">
              {tag.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingTags;
