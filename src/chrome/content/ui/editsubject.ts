class Editsubject {

    public static async onLoad(): Promise<void> {
        if ((window as any).arguments) {
            const retVals = (window as any).arguments[0];

            const subText = window.document.getElementById('subject_text') as HTMLInputElement|null;

            if (subText) {
                subText.value = retVals.subject;
            }

            const mTt = document.getElementById('move_to_trash') as HTMLInputElement|null;

            if (mTt) {
                if (retVals.moveToTrash) {
                    mTt.checked = true;
                } else {
                    mTt.checked = false;
                }
            }
        }
    }

    public static async save(): Promise<void> {
        if ((window as any).arguments) {
            const retVals = (window as any).arguments[0];

            const subText = window.document.getElementById('subject_text') as HTMLInputElement|null;
            const mTt = document.getElementById('move_to_trash') as HTMLInputElement|null;

            retVals.returnsubject = subText ? subText.value : '';
            retVals.moveToTrash = mTt ? mTt.checked : false;
            retVals.resulte = true;
        }

        window.close();
    }

    public static async cancel(): Promise<void> {
        if ((window as any).arguments) {
            const retVals = (window as any).arguments[0];

            retVals.resulte = false;
        }

        window.close();
    }

}

(async(): Promise<void> => {
    window.addEventListener('load', Editsubject.onLoad, false);
})();