import { forwardRef } from "react";

import classes from "./Flashcard.module.css";

const NewFlashcardRightSide = (props, ref) => {
  return (
    <div className={classes.newFlashcardSideContainer}>
      <h5 className={classes.headerRight}>Definition</h5>
      <textarea className={classes.right} ref={ref} />
    </div>
  );
};

export default forwardRef(NewFlashcardRightSide);
