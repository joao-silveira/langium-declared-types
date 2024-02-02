import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { DeclaredArray, DeclaredTypesAstType, InferredArray } from './generated/ast.js';
import type { DeclaredTypesServices } from './declared-types-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DeclaredTypesServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.DeclaredTypesValidator;
    const checks: ValidationChecks<DeclaredTypesAstType> = {
        InferredArray: [validator.checkAtLeasOneInferred],
        DeclaredArray: [validator.checkAtLeastOneDeclared]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DeclaredTypesValidator {

    checkAtLeasOneInferred(node: InferredArray, accept: ValidationAcceptor): void {
        if(node.elements.length === 0){
            accept('error', 'one element is required', { node });
        }
    }

    checkAtLeastOneDeclared(node: DeclaredArray, accept: ValidationAcceptor): void {     
    
        if(node.elements.length === 0){
            accept('error', 'one element is required', { node})
        }
    }

}
