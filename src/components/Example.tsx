
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export function Example() {
  return (
    <div
      css={css`
        padding: 32px;
        background-color: hotpink;
        font-size: 24px;
        border-radius: 4px;
        &:hover {
          color: white;
        }
      `}
    >
      Hover to change color
    </div>
  );
}