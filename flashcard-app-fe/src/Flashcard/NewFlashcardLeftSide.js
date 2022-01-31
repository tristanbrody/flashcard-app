import { forwardRef } from "react";

import classes from "./Flashcard.module.css";

const NewFlashcardLeftSide = (props, ref) => {
  return (
    <div className={classes.newFlashcardSideContainer}>
      <h5 className={classes.headerLeft}>Term</h5>
      <textarea
        className={classes.left}
        ref={ref}
        defaultValue={props.content || ""}
      ></textarea>
    </div>
  );
};

export default forwardRef(NewFlashcardLeftSide);
