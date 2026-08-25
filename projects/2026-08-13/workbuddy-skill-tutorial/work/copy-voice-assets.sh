#!/bin/sh
set -eu

destination="$(CDPATH= cd -- "$(dirname -- "$0")/../public" && pwd)/voice"
mkdir -p "$destination"

cp "/Users/winter/Downloads/workbuddy-skill-01-opening.mp3" "$destination/01-opening.mp3"
cp "/Users/winter/Downloads/workbuddy-skill-02-what-is-skill.mp3" "$destination/02-what-is-skill.mp3"
cp "/Users/winter/Downloads/workbuddy-skill-03-when-to-build.mp3" "$destination/03-when-to-build.mp3"
cp "/Users/winter/Downloads/workbuddy-skill-04-workflow-card.mp3" "$destination/04-workflow-card.mp3"
cp "/Users/winter/Downloads/workbuddy-skill-05-trigger-tests.mp3" "$destination/05-trigger-tests.mp3"
cp "/Users/winter/Downloads/workbuddy-skill-06-file-structure.mp3" "$destination/06-file-structure.mp3"
cp "/Users/winter/Downloads/workbuddy-skill-07-create.mp3" "$destination/07-create.mp3"
cp "/Users/winter/Downloads/workbuddy-skill-08-skill-md.mp3" "$destination/08-skill-md.mp3"
cp "/Users/winter/Downloads/workbuddy-skill-09-validate.mp3" "$destination/09-validate.mp3"
