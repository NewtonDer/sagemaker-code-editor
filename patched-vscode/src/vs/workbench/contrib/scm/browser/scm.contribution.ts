/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISCMService, ISCMViewService } from 'vs/workbench/contrib/scm/common/scm';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { SCMService } from 'vs/workbench/contrib/scm/common/scmService';
import { SCMViewService } from 'vs/workbench/contrib/scm/browser/scmViewService';
import { IQuickDiffService } from 'vs/workbench/contrib/scm/common/quickDiff';
import { QuickDiffService } from 'vs/workbench/contrib/scm/common/quickDiffService';

registerSingleton(ISCMService, SCMService, InstantiationType.Delayed);
registerSingleton(ISCMViewService, SCMViewService, InstantiationType.Delayed);
registerSingleton(IQuickDiffService, QuickDiffService, InstantiationType.Delayed);
