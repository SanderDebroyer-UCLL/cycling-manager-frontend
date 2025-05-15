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
