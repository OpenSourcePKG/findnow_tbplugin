/**
 * FindNow options for store.
 */
export type FindnowOptions = {
    export_overwrite: boolean;
    export_set_filetime: boolean;
    log_enable: boolean;
    export_filename_charset: string;

    export_filenames_addtime: boolean;
    export_eml_use_dir: boolean;
    export_eml_dir: string;
    export_eml_use_sub_dir: boolean;
    export_eml_sub_dir: string;
    use_filename_abbreviation: boolean;
    filename_abbreviation: string;
    allow_edit_subject: boolean;
    move_to_trash: boolean;

    export_save_auto_eml: boolean;

    // tmp settings
    last_used_directory: string;
};