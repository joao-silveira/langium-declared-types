import type { DefaultSharedModuleContext, LangiumServices, LangiumSharedServices, Module, PartialLangiumServices } from 'langium';
import { createDefaultModule, createDefaultSharedModule, inject  } from 'langium';
import { DeclaredTypesGeneratedModule, DeclaredTypesGeneratedSharedModule } from './generated/module.js';
import { DeclaredTypesValidator, registerValidationChecks } from './declared-types-validator.js';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type DeclaredTypesAddedServices = {
    validation: {
        DeclaredTypesValidator: DeclaredTypesValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type DeclaredTypesServices = LangiumServices & DeclaredTypesAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const DeclaredTypesModule: Module<DeclaredTypesServices, PartialLangiumServices & DeclaredTypesAddedServices> = {
    validation: {
        DeclaredTypesValidator: () => new DeclaredTypesValidator()
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createDeclaredTypesServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    DeclaredTypes: DeclaredTypesServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        DeclaredTypesGeneratedSharedModule
    );
    const DeclaredTypes = inject(
        createDefaultModule({ shared }),
        DeclaredTypesGeneratedModule,
        DeclaredTypesModule
    );
    shared.ServiceRegistry.register(DeclaredTypes);
    registerValidationChecks(DeclaredTypes);
    return { shared, DeclaredTypes };
}
