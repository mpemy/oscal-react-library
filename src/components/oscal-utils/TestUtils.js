import { screen } from "@testing-library/react";

function getByTextIncludingChildren(textMatch) {
  return screen.getByText((content, node) => {
    const hasText = (testNode) =>
      testNode.textContent === textMatch ||
      testNode.textContent.match(textMatch);
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      (child) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  });
}

export default getByTextIncludingChildren;
