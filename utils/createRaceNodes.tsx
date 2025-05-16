import { TreeNode } from 'primereact/treenode';

export const createTreeNodesFromRaces = (races: any[]) => {
  const niveauMap: Record<string, TreeNode> = {};

  races.forEach((race) => {
    if (!niveauMap[race.niveau]) {
      niveauMap[race.niveau] = {
        key: race.niveau,
        label: race.niveau,
        children: [],
        selectable: false,
      };
    }

    niveauMap[race.niveau].children!.push({
      key: String(race.id),
      label: race.name,
      data: race,
    });
  });

  return Object.values(niveauMap);
};


export const findSelectedRaceData = (selectedKeys: string[], nodes: TreeNode[]): any[] => {
  const result: any[] = [];

  const traverse = (nodeList: TreeNode[]) => {
    for (const node of nodeList) {
      if (selectedKeys.includes(String(node.key))) {
        result.push(node);
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  };

  traverse(nodes);
  return result;
};
