interface ObjectData {
  id: string;
  name: string;
  links: string[];
  history: string[];
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkData {
  source: string | ObjectData | undefined;
  target: string | ObjectData | undefined;
}

interface GraphProps {
  objects: ObjectData[];
}
