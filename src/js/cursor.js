function makeCounter() {
        let i = 0;
        return function() {
                i += 1;
                return i;
        }
}
count = makeCounter();

class Cursor {
        constructor(offset) {
                this.offset = offset;
                this.number = count();
        }

        moveLeft(buffer) {
                if (this.offset > 0) {
                        this.offset -= 1;
                }
        }

        moveRight(buffer) {
                if (this.offset < buffer.getText().length) {
                        this.offset += 1;
                }
        }

        moveUp(buffer) {

        }

        moveDown(buffer) {

        }

        draw(editor) {
                // Find position of cursor
                // -----------------------

                // if cursor is in middle of a word
                function isWhiteSpace(char) {return char === ' ' || char === '\n'}

                let aux1 = this.offset - 1;
                while (!isWhiteSpace(editor.innerHTML[aux1])) {
                        if (aux1 < 1) {
                                aux1 = 0;
                                break;
                        }
                        aux1 -= 1;
                }
                if (aux1 !== 0) {aux1 += 1}

                let aux2 = this.offset;
                while (!isWhiteSpace(editor.innerHTML[aux2])) {
                        if (aux2 > editor.innerHTML.length) {
                                aux2 = editor.innerHTML.length;
                                break;
                        }
                        aux2 += 1;
                }

                editor.innerHTML = editor.innerHTML.substr(0, aux1) + '<nobr>' + editor.innerHTML.substring(aux1, this.offset) + '<erase-me class="cursor"></erase-me>' + editor.innerHTML.substring(this.offset, aux2) + '</nobr>' + editor.innerHTML.substr(aux2);

                let eraseMe = document.getElementsByTagName('erase-me')[0];
                let offsetLeft = eraseMe.offsetLeft;
                let offsetTop = eraseMe.offsetTop;

                // Remove added stuff
                editor.innerHTML = editor.innerHTML.replace('<erase-me class="cursor"></erase-me>', '');
                editor.innerHTML = editor.innerHTML.replace(/<\/?nobr>/g, '');

                // Put cursor on editor
                // --------------------
                editor.innerHTML = `<cursor${this.number} class="cursor"></cursor${this.number}>` + editor.innerHTML;
                let cursor = document.getElementsByTagName(`cursor${this.number}`)[0];
                cursor.style.left = offsetLeft + 'px';
                cursor.style.top = offsetTop + 'px';
        }
}
