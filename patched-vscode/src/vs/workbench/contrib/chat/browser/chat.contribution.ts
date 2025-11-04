/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isMacintosh } from 'vs/base/common/platform';
import * as nls from 'vs/nls';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from 'vs/platform/configuration/common/configurationRegistry';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { Registry } from 'vs/platform/registry/common/platform';
import { EditorPaneDescriptor, IEditorPaneRegistry } from 'vs/workbench/browser/editor';
import { EditorExtensions } from 'vs/workbench/common/editor';
import { IChatAccessibilityService, IChatCodeBlockContextProviderService, IChatWidgetService, IQuickChatService } from 'vs/workbench/contrib/chat/browser/chat';
import { ChatAccessibilityService } from 'vs/workbench/contrib/chat/browser/chatAccessibilityService';
import { ChatEditor } from 'vs/workbench/contrib/chat/browser/chatEditor';
import { ChatEditorInput } from 'vs/workbench/contrib/chat/browser/chatEditorInput';
import { QuickChatService } from 'vs/workbench/contrib/chat/browser/chatQuick';
import { ChatVariablesService } from 'vs/workbench/contrib/chat/browser/chatVariables';
import { ChatWidgetService } from 'vs/workbench/contrib/chat/browser/chatWidget';
import { ChatCodeBlockContextProviderService } from 'vs/workbench/contrib/chat/browser/codeBlockContextProviderService';
import 'vs/workbench/contrib/chat/browser/contrib/chatInputEditorContrib';
import 'vs/workbench/contrib/chat/browser/contrib/chatContextAttachments';
import 'vs/workbench/contrib/chat/browser/contrib/chatInputCompletions';
import { ChatAgentNameService, ChatAgentService, IChatAgentNameService, IChatAgentService } from 'vs/workbench/contrib/chat/common/chatAgents';
import { IChatService } from 'vs/workbench/contrib/chat/common/chatService';
import { ChatService } from 'vs/workbench/contrib/chat/common/chatServiceImpl';
import { ChatSlashCommandService, IChatSlashCommandService } from 'vs/workbench/contrib/chat/common/chatSlashCommands';
import { IChatVariablesService } from 'vs/workbench/contrib/chat/common/chatVariables';
import { ChatWidgetHistoryService, IChatWidgetHistoryService } from 'vs/workbench/contrib/chat/common/chatWidgetHistoryService';
import { ILanguageModelsService, LanguageModelsService } from 'vs/workbench/contrib/chat/common/languageModels';
import { ILanguageModelStatsService, LanguageModelStatsService } from 'vs/workbench/contrib/chat/common/languageModelStats';
import { IVoiceChatService, VoiceChatService } from 'vs/workbench/contrib/chat/common/voiceChatService';
import '../common/chatColors';

// Register configuration
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'chatSidebar',
	title: nls.localize('interactiveSessionConfigurationTitle', "Chat"),
	type: 'object',
	properties: {
		'chat.editor.fontSize': {
			type: 'number',
			description: nls.localize('interactiveSession.editor.fontSize', "Controls the font size in pixels in chat codeblocks."),
			default: isMacintosh ? 12 : 14,
		},
		'chat.editor.fontFamily': {
			type: 'string',
			description: nls.localize('interactiveSession.editor.fontFamily', "Controls the font family in chat codeblocks."),
			default: 'default'
		},
		'chat.editor.fontWeight': {
			type: 'string',
			description: nls.localize('interactiveSession.editor.fontWeight', "Controls the font weight in chat codeblocks."),
			default: 'default'
		},
		'chat.editor.wordWrap': {
			type: 'string',
			description: nls.localize('interactiveSession.editor.wordWrap', "Controls whether lines should wrap in chat codeblocks."),
			default: 'off',
			enum: ['on', 'off']
		},
		'chat.editor.lineHeight': {
			type: 'number',
			description: nls.localize('interactiveSession.editor.lineHeight', "Controls the line height in pixels in chat codeblocks. Use 0 to compute the line height from the font size."),
			default: 0
		},
		'chat.experimental.implicitContext': {
			type: 'boolean',
			description: nls.localize('chat.experimental.implicitContext', "Controls whether a checkbox is shown to allow the user to determine which implicit context is included with a chat participant's prompt."),
			deprecated: true,
			default: false
		},
	}
});


Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ChatEditor,
		ChatEditorInput.EditorID,
		nls.localize('chat', "Chat")
	),
	[
		new SyncDescriptor(ChatEditorInput)
	]
);

registerSingleton(IChatService, ChatService, InstantiationType.Delayed);
registerSingleton(IChatWidgetService, ChatWidgetService, InstantiationType.Delayed);
registerSingleton(IQuickChatService, QuickChatService, InstantiationType.Delayed);
registerSingleton(IChatAccessibilityService, ChatAccessibilityService, InstantiationType.Delayed);
registerSingleton(IChatWidgetHistoryService, ChatWidgetHistoryService, InstantiationType.Delayed);
registerSingleton(ILanguageModelsService, LanguageModelsService, InstantiationType.Delayed);
registerSingleton(ILanguageModelStatsService, LanguageModelStatsService, InstantiationType.Delayed);
registerSingleton(IChatSlashCommandService, ChatSlashCommandService, InstantiationType.Delayed);
registerSingleton(IChatAgentService, ChatAgentService, InstantiationType.Delayed);
registerSingleton(IChatAgentNameService, ChatAgentNameService, InstantiationType.Delayed);
registerSingleton(IChatVariablesService, ChatVariablesService, InstantiationType.Delayed);
registerSingleton(IVoiceChatService, VoiceChatService, InstantiationType.Delayed);
registerSingleton(IChatCodeBlockContextProviderService, ChatCodeBlockContextProviderService, InstantiationType.Delayed);
