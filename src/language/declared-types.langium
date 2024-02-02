grammar DeclaredTypes

entry DeclaredTypes:
    InferredArray | DeclaredArray;

InferredArray:
    'inferred' (elements+=ArrayContent)* ';';

/**
 * Default values for properties inherited from a declared interface are not initialized.
 * 
 * This means if you e.g. do *.elements.length when there are no 'elements' you will get
 * a 'cannot filter undefined' error instead of 0.
 * 
 */
interface IAmArray {
   elements: ArrayContent[];
}

interface DeclaredArray extends IAmArray{ }

DeclaredArray returns DeclaredArray:
     'declared' (elements+=ArrayContent)* ';';

ArrayContent:
    name=ID;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
